from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import func
from app.services.s3_service import generate_presigned_download_url
from app.services.runpod_service import submit_transcription_job
from app.core.security import get_current_user_optional
from app.core.db import get_db_session as get_db
from app.models.user_usage_model import UserUsage
from app.models.subscriptions_model import Subscription

router = APIRouter()

class TranscribeRequest(BaseModel):
    file_key: str
    duration_seconds: int = 0
    num_speakers: int | None = None
    min_speakers: int | None = None
    max_speakers: int | None = None

@router.post("/transcribe")
def transcribe_audio(
    req: TranscribeRequest, 
    user=Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Submits a transcription job to RunPod Serverless worker.
    """
    duration = req.duration_seconds

    # Validate Unauthenticated quotas
    if not user:
        if duration > 180:
            raise HTTPException(status_code=403, detail="Anonymous users are limited to 3 minutes per audio.")
    else:
        current_month = datetime.utcnow().strftime("%Y-%m")
        # Sum total usage for this month
        usage_total = db.query(func.sum(UserUsage.seconds_used)).filter(
            UserUsage.user_id == user.id,
            UserUsage.month_year == current_month
        ).scalar() or 0

        # Admins have no limits
        if getattr(user, "is_admin", False) is False:
            # Check plan limits
            has_active_sub = any(sub.status == "active" for sub in getattr(user, "subscriptions", []))
            
            if has_active_sub:
                if duration > 7200:
                    raise HTTPException(status_code=403, detail="Premium limit: 120 minutes per audio.")
                if usage_total + duration > 72000:
                    raise HTTPException(status_code=403, detail="Premium limit: 1200 minutes total per month exceeded.")
            else:
                if duration > 180:
                    raise HTTPException(status_code=403, detail="Free limit: 3 minutes per audio.")
                if usage_total + duration > 1800:
                    raise HTTPException(status_code=403, detail="Free limit: 30 minutes total per month exceeded.")
        
        # Track usage
        usage_record = db.query(UserUsage).filter(
            UserUsage.user_id == user.id,
            UserUsage.month_year == current_month
        ).first()
        
        if usage_record:
            usage_record.seconds_used += duration
        else:
            usage_record = UserUsage(user_id=user.id, month_year=current_month, seconds_used=duration)
            db.add(usage_record)
        
        db.commit()

    try:
        # Generate a temporary GET URL so the worker can download the file
        read_url = generate_presigned_download_url(req.file_key, expires_in=3600)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate read URL: {str(e)}")

    try:
        job_id = submit_transcription_job(
            audio_url=read_url,
            num_speakers=req.num_speakers,
            min_speakers=req.min_speakers,
            max_speakers=req.max_speakers
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "status": "Processing",
        "job_id": job_id,
        "message": "Transcription job enqueued successfully"
    }
