import boto3
from botocore.config import Config
from app.core.config import settings

def get_s3_client():
    if not settings.R2_ACCOUNT_ID:
        # Dummy client for local testing without credentials
        return boto3.client('s3')

    return boto3.client(
        's3',
        endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        config=Config(signature_version='s3v4')
    )

def generate_presigned_upload_url(file_key: str, content_type: str, expires_in: int = 900) -> str:
    client = get_s3_client()
    return client.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': settings.R2_BUCKET_NAME,
            'Key': file_key,
            'ContentType': content_type
        },
        ExpiresIn=expires_in
    )

def generate_presigned_download_url(file_key: str, expires_in: int = 3600) -> str:
    client = get_s3_client()
    return client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': settings.R2_BUCKET_NAME,
            'Key': file_key
        },
        ExpiresIn=expires_in
    )
