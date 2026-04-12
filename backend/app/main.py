import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import upload, transcribe, status
from .api.endpoints.v1.users import user_router
from .api.endpoints.v1.auth import auth_router
from .api.endpoints.v1.webhooks import webhook_router
from .api.endpoints.v1.plans import plan_router
app = FastAPI(title="Whisper SaaS Config - MVP Backend", version="1.0.0")

# Read allowed origins from env var (comma-separated) — no rebuild needed when adding new frontends
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/v1", tags=["Upload"])
app.include_router(transcribe.router, prefix="/api/v1", tags=["Transcription"])
app.include_router(status.router, prefix="/api/v1", tags=["Status"])
app.include_router(user_router, prefix="/api/v1", tags=["Users"])
app.include_router(auth_router, prefix="/api/v1", tags=["Auth"])
app.include_router(webhook_router, prefix="/api/v1", tags=["Webhooks"])
app.include_router(plan_router, prefix="/api/v1", tags=["Plans"])
@app.get("/health")
def health_check():
    return {"status": "ok"}
