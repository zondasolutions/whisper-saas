import requests
from fastapi import APIRouter, HTTPException
from app.core.config import settings

router = APIRouter()

@router.get("/status/{job_id}")
def get_job_status(job_id: str):
    """
    Polls RunPod for the status of a transcription job.
    If RunPod is not configured, returns a local-mode response.
    """
    if not settings.RUNPOD_ENDPOINT_ID or not settings.RUNPOD_API_KEY:
        return {
            "status": "local_mode",
            "message": "RunPod not configured. Set RUNPOD_API_KEY and RUNPOD_ENDPOINT_ID to enable GPU transcription."
        }

    url = f"https://api.runpod.ai/v2/{settings.RUNPOD_ENDPOINT_ID}/status/{job_id}"
    headers = {"Authorization": f"Bearer {settings.RUNPOD_API_KEY}"}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        status = data.get("status")  # QUEUED | IN_PROGRESS | COMPLETED | FAILED

        if status == "COMPLETED":
            output = data.get("output", {})
            return {
                "status": "completed",
                "transcript": output.get("transcript"),
            }
        elif status == "FAILED":
            return {
                "status": "failed",
                "error": data.get("error", "Unknown error from RunPod"),
            }
        else:
            return {"status": "processing"}

    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to reach RunPod: {str(e)}")
