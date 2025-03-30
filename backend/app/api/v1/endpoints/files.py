# backend/app/api/v1/endpoints/files.py
from fastapi import APIRouter, UploadFile, HTTPException, Depends, BackgroundTasks, File
from sqlalchemy.orm import Session
from typing import List
import os

# Use aliased FileNotFoundError
from app.utils.exceptions import FileProcessingError, InvalidFileTypeError, FileTooLargeError, ModelError
from app.utils.exceptions import FileNotFoundError as CustomFileNotFoundError
from app.utils.file_utils import save_upload_file_to_dir # Renamed for clarity
from app.schemas.file import (
    FileDetailResponse,
    FileUploadResponse,
    FileProcessingResultResponse
)
from app.services.file_service import FileService
from app.database.session import get_db
from app.config.settings import get_settings
from app.utils.logger import setup_logger

router = APIRouter()
settings = get_settings()
logger = setup_logger("files_api")

# --- Dependency Injection for FileService ---
# This makes testing easier and manages service lifecycle if needed
def get_file_service():
    # In a real app, you might manage service instances differently
    return FileService()

@router.post("/upload", response_model=FileUploadResponse, status_code=202) # 202 Accepted
async def upload_file_for_processing(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    file_service: FileService = Depends(get_file_service)
):
    """
    Uploads an image file, saves it, creates a database record,
    and schedules background processing.
    """
    logger.info(f"Received file upload request: {file.filename}, Content-Type: {file.content_type}")

    # Basic validation before saving (can add more checks)
    try:
        file_service._validate_file(file) # Validate type before saving
    except InvalidFileTypeError as e:
         logger.warning(f"Upload rejected for {file.filename}: Invalid file type {file.content_type}")
         raise e # Re-raise the specific HTTP exception

    try:
        # Save the uploaded file
        saved_filename, saved_filepath = save_upload_file_to_dir(
            upload_file=file,
            destination_dir=settings.UPLOAD_DIR
        )
        logger.info(f"File '{saved_filename}' saved to '{saved_filepath}'")

        # Create the database record using the service
        db_file = file_service.create_file_record(
            db=db,
            filename=saved_filename,
            file_path=saved_filepath,
            file_type=file.content_type or "application/octet-stream" # Use provided type or default
        )

        # --- Schedule ML processing in the background ---
        logger.info(f"Scheduling background processing for file ID: {db_file.id}")
        background_tasks.add_task(file_service.process_file, db, db_file.id)

        return FileUploadResponse(
            message="File uploaded successfully and scheduled for processing.",
            file_id=db_file.id,
            filename=db_file.filename,
            status=db_file.status # Should be 'pending' initially
        )

    except (InvalidFileTypeError, FileTooLargeError) as e:
         # Handle validation errors raised by create_file_record (size check)
         logger.error(f"Validation failed after saving {file.filename}: {e.detail}")
         raise e
    except FileProcessingError as e:
        logger.error(f"File processing error during upload/record creation for {file.filename}: {e.detail}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to initiate file processing: {e.detail}")
    except Exception as e:
        logger.error(f"Unexpected error during file upload for {file.filename}: {str(e)}", exc_info=True)
        # Attempt cleanup if file was saved but DB failed or other error occurred
        if 'saved_filepath' in locals() and os.path.exists(saved_filepath):
            try:
                os.remove(saved_filepath)
                logger.info(f"Cleaned up file {saved_filepath} due to upload error.")
            except OSError as rm_err:
                logger.error(f"Failed to cleanup file {saved_filepath} after upload error: {rm_err}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


@router.get("/list", response_model=List[FileDetailResponse])
async def list_uploaded_files(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    file_service: FileService = Depends(get_file_service)
):
    """List recently uploaded files and their status."""
    try:
        files = file_service.list_files(db, skip=skip, limit=limit)
        # Map DB models to response schema
        response_files = []
        for f in files:
             # Construct URL for original file if needed (optional)
             # original_url = f"{settings.STATIC_URL}/{f.filename}" if f.status != 'deleted' else None # Example
             response_files.append(FileDetailResponse(
                 id=f.id,
                 filename=f.filename,
                 file_type=f.file_type,
                 status=f.status,
                 created_at=f.created_at,
                 updated_at=f.updated_at,
                 # original_file_url=original_url
             ))
        return response_files
    except FileProcessingError as e:
         raise HTTPException(status_code=500, detail=e.detail)
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to list files.")


@router.get("/status/{file_id}", response_model=FileProcessingResultResponse)
async def get_file_processing_status(
    file_id: int,
    db: Session = Depends(get_db),
    file_service: FileService = Depends(get_file_service)
):
    """Get the processing status and results (if completed) for a file."""
    try:
        file = file_service.get_file(db, file_id)

        response_data = {
            "id": file.id,
            "filename": file.filename,
            "status": file.status,
            "mean_reconstruction_b64": None,
            "uncertainty_map_b64": None,
            "error": None,
        }

        if file.status == "completed" and file.processing_result:
            response_data["mean_reconstruction_b64"] = file.processing_result.get("mean_reconstruction_b64")
            response_data["uncertainty_map_b64"] = file.processing_result.get("uncertainty_map_b64")
        elif file.status == "failed" and file.processing_result:
            response_data["error"] = file.processing_result.get("error")

        return FileProcessingResultResponse(**response_data)

    except CustomFileNotFoundError as e:
        logger.warning(f"Status request for non-existent file ID: {file_id}")
        raise HTTPException(status_code=404, detail=e.detail)
    except Exception as e:
        logger.error(f"Error getting status for file ID {file_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get file status: {str(e)}")


@router.post("/process/{file_id}", response_model=FileProcessingResultResponse, status_code=202)
async def trigger_file_processing(
    file_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    file_service: FileService = Depends(get_file_service)
):
    """
    Explicitly triggers ML processing for a file (e.g., for reprocessing failed ones).
    Returns the current status immediately, processing happens in background.
    """
    try:
        # Check if file exists first
        file = file_service.get_file(db, file_id)

        if file.status == "processing":
             raise HTTPException(status_code=409, detail="File is already being processed.")
        if file.status == "completed":
             # Optionally allow reprocessing completed files or return current results
             logger.info(f"File ID {file_id} is already completed. Re-scheduling processing.")
             # raise HTTPException(status_code=409, detail="File has already been processed successfully.")

        logger.info(f"Explicitly scheduling background processing for file ID: {file_id}")
        background_tasks.add_task(file_service.process_file, db, file_id)

        # Return current status (likely 'pending' or 'failed' before background task runs)
        return await get_file_processing_status(file_id, db, file_service)

    except CustomFileNotFoundError as e:
        logger.warning(f"Processing trigger request for non-existent file ID: {file_id}")
        raise HTTPException(status_code=404, detail=e.detail)
    except HTTPException as e: # Re-raise specific HTTP exceptions
        raise e
    except Exception as e:
        logger.error(f"Error triggering processing for file ID {file_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to trigger file processing: {str(e)}")


@router.delete("/{file_id}", status_code=200)
async def delete_uploaded_file_endpoint(
    file_id: int,
    db: Session = Depends(get_db),
    file_service: FileService = Depends(get_file_service)
):
    """Delete a file record and its associated file from disk."""
    try:
        deleted = file_service.delete_file_record(db, file_id)
        if deleted:
            return {"message": f"File ID {file_id} deleted successfully"}
        else:
            # This case might occur if DB deletion fails after file check
            raise HTTPException(status_code=500, detail="Failed to delete file record.")
    except CustomFileNotFoundError as e:
        logger.warning(f"Deletion request for non-existent file ID: {file_id}")
        raise HTTPException(status_code=404, detail=e.detail)
    except Exception as e:
        logger.error(f"Error deleting file ID {file_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
