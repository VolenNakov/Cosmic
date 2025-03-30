# backend/app/services/file_service.py
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import os
from pathlib import Path
from fastapi import UploadFile # Import UploadFile for type hinting
from app.models.file import FileUpload
from app.schemas.file import FileUploadCreate, ProcessingResult # Import schemas
from app.services.ml_service import MLService # Corrected import path
from app.utils.logger import setup_logger
from app.utils.exceptions import (
    FileProcessingError,
    FileNotFoundError as CustomFileNotFoundError, # Alias to avoid name clash
    InvalidFileTypeError,
    FileTooLargeError
)
from app.config.settings import get_settings # Import settings

logger = setup_logger("file_service")
settings = get_settings() # Get settings instance

class FileService:
    def __init__(self):
        # Initialize MLService here or pass it if managed elsewhere (e.g., dependency injection)
        self.ml_service = MLService()
        self.max_file_size = 50 * 1024 * 1024  # Increased to 50MB for potentially large space images
        self.allowed_types = ["image/jpeg", "image/png", "image/tiff", "image/bmp"] # Added common types
        logger.info(f"File Service initialized. Max size: {self.max_file_size / (1024*1024)}MB, Allowed types: {self.allowed_types}")

    def _validate_file(self, file: UploadFile):
        """Validates file type and size directly from UploadFile."""
        if file.content_type not in self.allowed_types:
            logger.warning(f"Invalid file type uploaded: {file.content_type}. Filename: {file.filename}")
            raise InvalidFileTypeError(file.content_type)

        # Check size - This requires reading the file, might be better done after saving
        # For now, we'll rely on potential web server limits or check after saving.
        # A more robust way involves streaming and checking size incrementally.

    def _validate_saved_file(self, file_path: str, file_type: str):
        """Validates saved file size."""
        try:
            file_size = os.path.getsize(file_path)
            if file_size > self.max_file_size:
                 logger.warning(f"File exceeds max size ({self.max_file_size} bytes): {file_path} ({file_size} bytes)")
                 # Clean up oversized file
                 try:
                     os.remove(file_path)
                     logger.info(f"Removed oversized file: {file_path}")
                 except OSError as e:
                     logger.error(f"Failed to remove oversized file {file_path}: {e}")
                 raise FileTooLargeError(self.max_file_size // (1024 * 1024))
            logger.info(f"File validation passed for {file_path}. Size: {file_size} bytes.")
        except FileNotFoundError:
             logger.error(f"File not found for size validation: {file_path}")
             raise CustomFileNotFoundError(f"File disappeared before size validation: {file_path}")
        except Exception as e:
             logger.error(f"Error during saved file validation for {file_path}: {e}", exc_info=True)
             raise FileProcessingError(f"Error validating saved file: {e}")


    def create_file_record(self, db: Session, filename: str, file_path: str, file_type: str) -> FileUpload:
        """Creates the database record for the uploaded file."""
        try:
            # Validate size *after* saving
            self._validate_saved_file(file_path, file_type)

            db_file = FileUpload(
                filename=filename,
                file_path=file_path, # Store the absolute path
                file_type=file_type,
                status="pending" # Initial status
            )
            db.add(db_file)
            db.commit()
            db.refresh(db_file)
            logger.info(f"Created file record ID: {db_file.id} for {filename}")
            return db_file
        except (InvalidFileTypeError, FileTooLargeError) as e:
            # Re-raise validation errors
             raise e
        except Exception as e:
            logger.error(f"Database error creating file record for {filename}: {str(e)}", exc_info=True)
            # Attempt to clean up saved file if DB entry failed
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    logger.info(f"Cleaned up file {file_path} due to DB error.")
                except OSError as rm_err:
                    logger.error(f"Failed to cleanup file {file_path} after DB error: {rm_err}")
            raise FileProcessingError(f"Database error: {str(e)}")

    def get_file(self, db: Session, file_id: int) -> Optional[FileUpload]:
        logger.debug(f"Querying for file with ID: {file_id}")
        file = db.query(FileUpload).filter(FileUpload.id == file_id).first()
        if not file:
            logger.warning(f"File with ID {file_id} not found in database.")
            # Raise specific exception defined in utils/exceptions.py
            raise CustomFileNotFoundError(file_id=file_id)
        logger.debug(f"Found file record ID: {file_id}, Status: {file.status}")
        return file

    def list_files(self, db: Session, skip: int = 0, limit: int = 100) -> List[FileUpload]:
        try:
            files = db.query(FileUpload).order_by(FileUpload.created_at.desc()).offset(skip).limit(limit).all()
            logger.info(f"Retrieved {len(files)} file records (skip={skip}, limit={limit}).")
            return files
        except Exception as e:
            logger.error(f"Error listing files from database: {str(e)}", exc_info=True)
            # Avoid raising generic FileProcessingError, maybe return empty list or re-raise specific DB error
            raise FileProcessingError(f"Database error listing files: {str(e)}")

    def update_file_status(self, db: Session, file_id: int, status: str, results: Optional[Dict[str, Any]] = None):
        """Helper to update file status and results."""
        try:
            file = self.get_file(db, file_id) # Use get_file to ensure it exists
            file.status = status
            if results is not None:
                file.processing_result = results
            db.commit()
            db.refresh(file)
            logger.info(f"Updated status for file ID {file_id} to '{status}'.")
            return file
        except CustomFileNotFoundError:
            # Log error but don't crash if file disappeared between check and update
            logger.error(f"Cannot update status for non-existent file ID {file_id}.")
            return None
        except Exception as e:
            logger.error(f"Database error updating status for file ID {file_id}: {str(e)}", exc_info=True)
            db.rollback() # Rollback on error
            raise FileProcessingError(f"Database error updating file status: {str(e)}")


    def process_file(self, db: Session, file_id: int) -> FileUpload:
        """Processes the file using the ML service and updates the DB record."""
        file = self.get_file(db, file_id) # Raises CustomFileNotFoundError if not found

        if file.status not in ["pending", "failed"]: # Allow reprocessing failed files
             logger.warning(f"File ID {file_id} is already '{file.status}'. Skipping processing.")
             # Optionally raise an error or just return the current state
             # raise FileProcessingError(f"File is already {file.status}")
             return file

        logger.info(f"Starting ML processing for file ID: {file_id}, Path: {file.file_path}")
        self.update_file_status(db, file_id, "processing")

        try:
            # Call the ML service
            ml_result = self.ml_service.process_image(file.file_path)

            if ml_result["status"] == "success":
                logger.info(f"ML processing successful for file ID: {file_id}")
                # Store the base64 strings directly
                processing_data = {
                    "mean_reconstruction_b64": ml_result["mean_reconstruction_b64"],
                    "uncertainty_map_b64": ml_result["uncertainty_map_b64"]
                }
                final_status = "completed"
            else:
                error_msg = ml_result.get("error_message", "Unknown ML error")
                logger.error(f"ML processing failed for file ID: {file_id}. Reason: {error_msg}")
                processing_data = {"error": error_msg}
                final_status = "failed"

            # Update status and results
            updated_file = self.update_file_status(db, file_id, final_status, processing_data)
            return updated_file

        except Exception as e:
            # Catch broad exceptions during the process call or status update
            error_msg = f"Unhandled error during processing pipeline for file ID {file_id}: {str(e)}"
            logger.error(error_msg, exc_info=True)
            # Attempt to mark as failed
            try:
                self.update_file_status(db, file_id, "failed", {"error": error_msg})
            except Exception as update_err:
                 logger.error(f"Failed to even update status to failed for file ID {file_id} after error: {update_err}")
            # Re-raise a generic processing error
            raise FileProcessingError(error_msg)

    def delete_file_record(self, db: Session, file_id: int) -> bool:
        """Deletes the file record and the associated file from disk."""
        file = self.get_file(db, file_id) # Raises if not found

        file_path = file.file_path
        try:
            db.delete(file)
            db.commit()
            logger.info(f"Deleted file record ID: {file_id} from database.")

            # Attempt to delete file from disk
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    logger.info(f"Deleted file from disk: {file_path}")
                except OSError as e:
                    logger.error(f"Error deleting file {file_path} from disk after DB record deletion: {e}")
                    # Decide if this should be considered a failure overall
            return True
        except Exception as e:
            logger.error(f"Error deleting file record ID {file_id}: {str(e)}", exc_info=True)
            db.rollback()
            return False
