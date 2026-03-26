from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Whisper SaaS MVP"
    R2_BUCKET_NAME: str = "whisper-saas-audio"
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    RUNPOD_API_KEY: str = ""
    RUNPOD_ENDPOINT_ID: str = ""
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
