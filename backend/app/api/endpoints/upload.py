from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.s3_service import generate_presigned_upload_url
import uuid

router = APIRouter()

class UploadRequest(BaseModel):
    filename: str
    content_type: str

def get_current_user():
    # Placeholder for actual auth logic (JWT verification)
    return {"user_id": "usr_" + str(uuid.uuid4())[:8]}

@router.post("/upload-url")
def get_upload_url(req: UploadRequest, user: dict = Depends(get_current_user)):
    file_key = f"uploads/{user['user_id']}/{req.filename}"
    try:
        url = generate_presigned_upload_url(file_key, req.content_type)
        return {
            "upload_url": url,
            "file_key": file_key
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
