# NeuroPixel Project

A modern web application with FastAPI backend and React frontend.

## Project Structure

```
.
├── backend/         # FastAPI backend
│   ├── app/        # Application code
│   ├── tests/      # Backend tests
│   └── requirements.txt
└── frontend/       # React frontend (to be implemented)
```

## Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000
API documentation will be available at http://localhost:8000/docs

## Frontend Setup

To be implemented. 