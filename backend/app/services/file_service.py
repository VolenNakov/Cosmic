from sqlalchemy.orm import Session
from typing import List, Optional
import os
from pathlib import Path
from ..models.file import FileUpload
from ..schemas.file import FileUploadCreate
from .ml_service import MLService
from ..utils.logger import setup_logger
from ..utils.exceptions import (
    FileProcessingError,
    FileNotFoundError,
    InvalidFileTypeError,
    FileTooLargeError
)

logger = setup_logger("file_service")

class FileService:
    def __init__(self):
        self.ml_service = MLService()
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.allowed_types = ["image/jpeg", "image/png"]
        logger.info("File Service initialized")

    def _validate_file(self, file_data: FileUploadCreate, file_size: int):
        if file_data.file_type not in self.allowed_types:
            raise InvalidFileTypeError(file_data.file_type)
        
        if file_size > self.max_file_size:
            raise FileTooLargeError(self.max_file_size // (1024 * 1024))

    def create_file(self, db: Session, file_data: FileUploadCreate, file_path: str) -> FileUpload:
        try:
            file_size = os.path.getsize(file_path)
            self._validate_file(file_data, file_size)

            db_file = FileUpload(
                filename=file_data.filename,
                file_path=file_path,
                file_type=file_data.file_type,
                status="pending"
            )
            db.add(db_file)
            db.commit()
            db.refresh(db_file)
            logger.info(f"Created file entry with ID: {db_file.id}")
            return db_file
        except Exception as e:
            logger.error(f"Error creating file entry: {str(e)}")
            raise FileProcessingError(str(e))

    def get_file(self, db: Session, file_id: int) -> Optional[FileUpload]:
        file = db.query(FileUpload).filter(FileUpload.id == file_id).first()
        if not file:
            logger.warning(f"File with ID {file_id} not found")
            raise FileNotFoundError(file_id)
        return file

    def list_files(self, db: Session, skip: int = 0, limit: int = 100) -> List[FileUpload]:
        try:
            files = db.query(FileUpload).offset(skip).limit(limit).all()
            logger.info(f"Retrieved {len(files)} files")
            return files
        except Exception as e:
            logger.error(f"Error listing files: {str(e)}")
            raise FileProcessingError(str(e))

    def process_file(self, db: Session, file_id: int) -> Optional[FileUpload]:
        try:
            file = self.get_file(db, file_id)
            if not file:
                return None

            logger.info(f"Starting processing for file ID: {file_id}")
            file.status = "processing"
            db.commit()

            # Process the file using ML service
            result = self.ml_service.process_image(file.file_path)
            
            if result["status"] == "success":
                file.processing_result = {
                    "mean_reconstruction": result["mean_reconstruction_b64"],
                    "uncertainty_map": result["uncertainty_map_b64"]
                }
                file.status = "completed"
                logger.info(f"Successfully processed file ID: {file_id}")
            else:
                file.processing_result = {"error": result["error_message"]}
                file.status = "failed"
                logger.error(f"Failed to process file ID: {file_id}: {result['error_message']}")

            db.commit()
            return file

        except Exception as e:
            logger.error(f"Error processing file ID {file_id}: {str(e)}")
            if file:
                file.status = "failed"
                file.processing_result = {"error": str(e)}
                db.commit()
            raise FileProcessingError(str(e)) 