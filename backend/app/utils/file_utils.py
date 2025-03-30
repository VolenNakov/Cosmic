import os
from pathlib import Path
from typing import Optional
from fastapi import UploadFile
from config.settings import get_settings

settings = get_settings()

def get_upload_path(filename: str) -> Path:
    """Get the full path for an uploaded file."""
    return Path(settings.UPLOAD_DIR) / filename

def save_upload_file(upload_file: UploadFile) -> str:
    """Save an uploaded file and return its filename."""
    # Create a safe filename
    filename = upload_file.filename
    file_path = get_upload_path(filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        content = upload_file.file.read()
        buffer.write(content)
    
    return filename

def delete_file(filename: str) -> bool:
    """Delete a file by its filename."""
    file_path = get_upload_path(filename)
    try:
        if file_path.exists():
            file_path.unlink()
            return True
        return False
    except Exception:
        return False

def get_file_url(filename: str) -> Optional[str]:
    """Get the URL for accessing a file."""
    if not filename:
        return None
    return f"{settings.STATIC_URL}/{filename}"

def list_uploaded_files() -> list[str]:
    """List all files in the upload directory."""
    upload_dir = Path(settings.UPLOAD_DIR)
    if not upload_dir.exists():
        return []
    return [f.name for f in upload_dir.iterdir() if f.is_file()] 