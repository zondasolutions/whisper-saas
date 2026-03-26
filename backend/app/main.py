from fastapi import FastAPI
from app.api.endpoints import upload, transcribe

app = FastAPI(title="Whisper SaaS Config - MVP Backend", version="1.0.0")

app.include_router(upload.router, prefix="/api/v1", tags=["Upload"])
app.include_router(transcribe.router, prefix="/api/v1", tags=["Transcription"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
