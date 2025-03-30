# backend/app/schemas/file.py
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

# Base schema for file properties identifiable upon upload
class FileBase(BaseModel):
    filename: str
    file_type: Optional[str] = None # Made optional, can be inferred

# Schema for creating a file record (used internally by service)
class FileUploadCreate(FileBase):
    file_path: str # Path where the file is saved

# Schema representing the full file record in the database
class FileRecord(FileBase):
    id: int
    file_path: str
    status: str = Field(..., description="Processing status: pending, processing, completed, failed")
    processing_result: Optional[Dict[str, Any]] = Field(None, description="Stores ML results (e.g., base64 images) or error message")
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True # Pydantic V2 way to enable ORM mode

# Schema for the response when listing files or getting a single file's details
class FileDetailResponse(BaseModel):
    id: int
    filename: str
    file_type: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    # Optionally include a URL to the original file if needed
    original_file_url: Optional[str] = None

# Schema for the response containing processing results
class FileProcessingResultResponse(BaseModel):
    id: int
    filename: str
    status: str
    mean_reconstruction_b64: Optional[str] = None
    uncertainty_map_b64: Optional[str] = None
    error: Optional[str] = None # Include error message if status is 'failed'

# Schema for the basic response after uploading a file (gives ID for status checks)
class FileUploadResponse(BaseModel):
    message: str
    file_id: int
    filename: str
    status: str # Initial status ('pending')
