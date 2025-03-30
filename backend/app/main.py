# backend/app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.config.settings import get_settings # Corrected import path
from app.api.v1.endpoints import files # Corrected import path
from app.database.base import engine, Base # Import Base
from app.models import file as file_model # Import the models module
from app.utils.logger import setup_logger # Import logger
from app.utils.exceptions import ( # Import custom exceptions
     FileProcessingError, ModelError, CustomFileNotFoundError,
     InvalidFileTypeError, FileTooLargeError
)
from fastapi import HTTPException # Import standard HTTPException

# Initialize logger
logger = setup_logger("main_app")

# Create database tables if they don't exist
# This should ideally be handled by migrations (e.g., Alembic) in production
logger.info("Attempting to create database tables...")
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables checked/created.")
except Exception as e:
    logger.error(f"Error creating database tables: {e}", exc_info=True)
    # Decide if the app should exit or continue without DB functionality

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME, # Use updated name
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
logger.info(f"CORS Origins allowed: {settings.BACKEND_CORS_ORIGINS}")
logger.info(f"Upload directory: {settings.UPLOAD_DIR}")
logger.info(f"Static URL path: {settings.STATIC_URL}")
logger.info(f"Model path: {settings.MODEL_PATH}")


# --- Global Exception Handlers ---
# Add handlers for your custom exceptions to return consistent JSON errors
@app.exception_handler(CustomFileNotFoundError)
async def file_not_found_exception_handler(request: Request, exc: CustomFileNotFoundError):
    logger.warning(f"Resource not found: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(InvalidFileTypeError)
async def invalid_file_type_exception_handler(request: Request, exc: InvalidFileTypeError):
    logger.warning(f"Invalid file type: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(FileTooLargeError)
async def file_too_large_exception_handler(request: Request, exc: FileTooLargeError):
    logger.warning(f"File too large: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(FileProcessingError)
async def file_processing_exception_handler(request: Request, exc: FileProcessingError):
    logger.error(f"File processing error: {exc.detail}", exc_info=True) # Log stack trace
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(ModelError)
async def model_error_exception_handler(request: Request, exc: ModelError):
    logger.critical(f"ML Model error: {exc.detail}", exc_info=True) # Log stack trace
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Optional: Catch-all for standard HTTPExceptions if needed
# @app.exception_handler(HTTPException)
# async def http_exception_handler(request: Request, exc: HTTPException):
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={"detail": exc.detail},
#     )

# Optional: Catch-all for unexpected server errors
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )


# --- Middleware ---
# Set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
     logger.warning("CORS is disabled as BACKEND_CORS_ORIGINS is empty.")


# --- Static Files ---
# Mount static files AFTER middleware and BEFORE routers if possible
# Ensure the directory exists
upload_dir_path = Path(settings.UPLOAD_DIR)
upload_dir_path.mkdir(parents=True, exist_ok=True)
logger.info(f"Mounting static directory '{settings.UPLOAD_DIR}' at URL '{settings.STATIC_URL}'")
app.mount(settings.STATIC_URL, StaticFiles(directory=settings.UPLOAD_DIR), name="static_uploads")


# --- API Routers ---
# Include API router
logger.info(f"Including API router at prefix '{settings.API_V1_STR}/files'")
app.include_router(files.router, prefix=f"{settings.API_V1_STR}/files", tags=["Files & Processing"])


# --- Root Endpoint ---
@app.get("/")
def read_root():
    logger.info("Root endpoint '/' accessed.")
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "docs_url": app.docs_url, # Use FastAPI's dynamic URLs
        "redoc_url": app.redoc_url
    }

# --- Optional: Add startup/shutdown events ---
@app.on_event("startup")
async def startup_event():
     logger.info("Application startup complete.")
     # You could initialize ML model here instead of in service __init__
     # if you want it loaded only once globally. Requires careful state management.

@app.on_event("shutdown")
async def shutdown_event():
     logger.info("Application shutting down.")
     # Add cleanup tasks here if needed
