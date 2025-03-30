class Settings:
    PROJECT_NAME: str = "NeuroPixel"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # ML Model settings
    MODEL_PATH: str = "models/ml_model"  # Path to your ML model

def get_settings():
    return Settings() 