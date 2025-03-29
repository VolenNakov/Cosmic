import os
from typing import Optional
from fastapi import UploadFile

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload_file(file: UploadFile) -> Optional[str]:
    """
    Save an uploaded file and return its path
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        return file_path
    except Exception as e:
        print(f"Error saving file: {str(e)}")
        return None

def get_file_extension(filename: str) -> str:
    """
    Get the file extension from a filename
    """
    return os.path.splitext(filename)[1].lower() 