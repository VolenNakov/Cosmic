# DeepSpace Compress AI Backend

FastAPI backend for image compression and uncertainty analysis. Uses a custom ML model to generate uncertainty maps for uploaded images.

## Quick Start

1. Set up environment:
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run the server:
```bash
# Make sure you're in the backend directory
cd backend
python -m uvicorn main:app --reload
```

## API Endpoints

- `POST /api/v1/files/upload` - Upload image
- `GET /api/v1/files/` - List files
- `GET /api/v1/files/{file_id}` - Get file details

## Development

```bash
# Run tests
pytest

# Format code
black .
isort .
```

## Requirements

- Python 3.8+
- PostgreSQL
- CUDA GPU (recommended)

## License

MIT 