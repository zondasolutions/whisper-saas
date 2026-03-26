from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.s3_service import generate_presigned_download_url
from app.services.runpod_service import submit_transcription_job

router = APIRouter()

class TranscribeRequest(BaseModel):
    file_key: str

def get_current_user():
    # Placeholder for actual auth logic (JWT verification)
    return {"user_id": "authenticated_user"}

@router.post("/transcribe")
def transcribe_audio(req: TranscribeRequest, user: dict = Depends(get_current_user)):
    """
    Submits a transcription job to RunPod Serverless worker.
    """
    try:
        # Generate a temporary GET URL so the worker can download the file
        read_url = generate_presigned_download_url(req.file_key, expires_in=3600)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate read URL: {str(e)}")

    try:
        job_id = submit_transcription_job(audio_url=read_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "status": "Processing",
        "job_id": job_id,
        "message": "Transcription job enqueued successfully"
    }
