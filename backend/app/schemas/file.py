from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class FileUploadBase(BaseModel):
    filename: str
    file_type: str

class FileUploadCreate(FileUploadBase):
    pass

class FileUpload(FileUploadBase):
    id: int
    file_path: str
    status: str
    processing_result: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProcessingResult(BaseModel):
    file_id: int
    result: Dict[str, Any]
    status: str 