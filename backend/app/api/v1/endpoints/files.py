from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from database.session import get_db
from app.schemas.file import FileUpload, FileUploadCreate, ProcessingResult
from app.services.file_service import FileService
from app.utils.file_utils import save_upload_file

router = APIRouter()
file_service = FileService()

@router.post("/upload", response_model=FileUpload)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_path = await save_upload_file(file)
    if not file_path:
        raise HTTPException(status_code=400, detail="Failed to save file")
    
    file_data = FileUploadCreate(
        filename=file.filename,
        file_type=file.content_type
    )
    db_file = file_service.create_file(db, file_data, file_path)
    
    background_tasks.add_task(file_service.process_file, db, db_file.id)
    
    return db_file

@router.get("/", response_model=List[FileUpload])
def list_files(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return file_service.list_files(db, skip, limit)

@router.get("/{file_id}", response_model=FileUpload)
def get_file(file_id: int, db: Session = Depends(get_db)):
    file = file_service.get_file(db, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file 