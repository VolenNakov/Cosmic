from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config.settings import get_settings
from app.api.v1.api import api_router
from database.base import engine
from app.models.file import FileUpload

# Create database tables
FileUpload.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount(settings.STATIC_URL, StaticFiles(directory=settings.UPLOAD_DIR), name="static")

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to NeuroPixel API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    } 