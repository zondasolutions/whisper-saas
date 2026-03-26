from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Whisper SaaS MVP"
    S3_BUCKET: str = "transcriptions-bucket"
    R2_ACCOUNT_ID: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    RUNPOD_API_KEY: str = ""
    RUNPOD_ENDPOINT_ID: str = ""
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
