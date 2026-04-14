import requests
from app.core.config import settings
from fastapi import HTTPException

def submit_transcription_job(
    audio_url: str,
    num_speakers: int | None = None,
    min_speakers: int | None = None,
    max_speakers: int | None = None,
    initial_prompt: str | None = None,
    return_clean_audio: bool = False,
) -> str:
    """Submits a job to the RunPod serverless endpoint."""
    if not settings.RUNPOD_ENDPOINT_ID or not settings.RUNPOD_API_KEY:
        # Simulate local development by returning a dummy Job ID
        return "local-dummy-job-1234"

    url = f"https://api.runpod.ai/v2/{settings.RUNPOD_ENDPOINT_ID}/run"
    headers = {
        "Authorization": f"Bearer {settings.RUNPOD_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "input": {
            "audio_url": audio_url
        }
    }
    
    if num_speakers is not None:
        payload["input"]["num_speakers"] = num_speakers
    if min_speakers is not None:
        payload["input"]["min_speakers"] = min_speakers
    if max_speakers is not None:
        payload["input"]["max_speakers"] = max_speakers
    if initial_prompt:
        payload["input"]["initial_prompt"] = initial_prompt
    if return_clean_audio:
        payload["input"]["return_clean_audio"] = True
        
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise HTTPException(
            status_code=500, 
            detail=f"RunPod execution failed: {response.text}"
        )
        
    return response.json().get("id")
