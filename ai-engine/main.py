
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from detector import detect_sensitive_data, calculate_privacy_score

app = FastAPI(
    title="DataShield AI",
    description="Personal Data Protection and Detection API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScanRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "success": True,
        "message": "DataShield AI Detection Engine is running!"
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "Healthy",
        "service": "DataShield AI"
    }


@app.post("/api/detect")
def detect_data(request: ScanRequest):
    try:
        detections = detect_sensitive_data(request.text)
        privacy_score = calculate_privacy_score(detections)

        return {
            "success": True,
            "total_detected": len(detections),
            "privacy_score": privacy_score,
            "detections": detections
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
