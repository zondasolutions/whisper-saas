from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Whisper SaaS MVP"
    R2_BUCKET_NAME: str = "whisper-saas-audio"
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    RUNPOD_API_KEY: str = ""
    RUNPOD_ENDPOINT_ID: str = ""

    # Email
    EMAILS_ENABLED: bool = False
    EMAIL_BACKEND: str = "console"
    EMAIL_BANNER_URL: str = ""
    RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # SMTP
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASS: Optional[str] = None
    SMTP_FROM: Optional[str] = None
    SMTP_TLS: bool = False
    SMTP_SSL: bool = False

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()