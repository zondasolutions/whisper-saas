from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import upload, transcribe, status
from .api.endpoints.v1.users import user_router

app = FastAPI(title="Whisper SaaS Config - MVP Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/v1", tags=["Upload"])
app.include_router(transcribe.router, prefix="/api/v1", tags=["Transcription"])
app.include_router(status.router, prefix="/api/v1", tags=["Status"])
app.include_router(user_router, prefix="/api/v1", tags=["Users"])
@app.get("/health")
def health_check():
    return {"status": "ok"}
