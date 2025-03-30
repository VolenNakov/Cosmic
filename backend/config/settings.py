import os
from pathlib import Path

class Settings:
    PROJECT_NAME: str = "COSMIC"
    PROJECT_DESCRIPTION: str = "Compressed Optimized Space Mission Imagery Codec"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173",  # Alternative localhost
        "http://localhost:3000",  # Alternative port
    ]
    
    # File upload settings
    UPLOAD_DIR: str = "uploads"
    STATIC_URL: str = "/static"
    
    # ML Model settings
    MODEL_PATH: str = "models/ml_model"  # Path to your ML model

    def __init__(self):
        # Create upload directory if it doesn't exist
        upload_dir = Path(self.UPLOAD_DIR)
        upload_dir.mkdir(parents=True, exist_ok=True)

def get_settings():
    return Settings() 