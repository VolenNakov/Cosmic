from fastapi import APIRouter, UploadFile, HTTPException
from typing import List
from app.utils.file_utils import save_upload_file, list_uploaded_files, get_file_url, delete_file
from app.schemas.file import FileResponse

router = APIRouter()

@router.post("/upload", response_model=FileResponse)
async def upload_file(file: UploadFile):
    """Upload a file and return its URL."""
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    try:
        filename = save_upload_file(file)
        return FileResponse(
            filename=filename,
            url=get_file_url(filename)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list", response_model=List[FileResponse])
async def list_files():
    """List all uploaded files."""
    files = list_uploaded_files()
    return [
        FileResponse(
            filename=filename,
            url=get_file_url(filename)
        )
        for filename in files
    ]

@router.delete("/{filename}")
async def delete_uploaded_file(filename: str):
    """Delete a file by its filename."""
    if delete_file(filename):
        return {"message": "File deleted successfully"}
    raise HTTPException(status_code=404, detail="File not found") 