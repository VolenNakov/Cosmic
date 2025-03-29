from fastapi import HTTPException, status

class FileProcessingError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File processing error: {detail}"
        )

class ModelError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ML model error: {detail}"
        )

class FileNotFoundError(HTTPException):
    def __init__(self, file_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with ID {file_id} not found"
        )

class InvalidFileTypeError(HTTPException):
    def __init__(self, file_type: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file_type}. Supported types: image/jpeg, image/png"
        )

class FileTooLargeError(HTTPException):
    def __init__(self, max_size: int):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {max_size}MB"
        ) 