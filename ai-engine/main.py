
from fastapi import FastAPI

app = FastAPI(
    title="DataShield AI",
    description="AI-Based Personal Data Protection System",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "DataShield AI Engine is running!"
    }

@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "Healthy",
        "engine": "DataShield AI"
    }
