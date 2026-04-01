from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()  # Carga las variables de entorno desde el archivo .env

class Settings(BaseSettings):
    PROJECT_NAME: str = "Whisper SaaS MVP"
    R2_BUCKET_NAME: str = "whisper-saas-audio"
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    RUNPOD_API_KEY: str = ""
    RUNPOD_ENDPOINT_ID: str = ""

    # Database
    DB_USER: str = os.getenv("DB_USER")
    DB_PASS: str = os.getenv("DB_PASS")
    DB_HOST: str = os.getenv("DB_HOST")
    DB_PORT: int = int(os.getenv("DB_PORT"))
    DB_NAME: str = os.getenv("DB_NAME")
    DB_SCHEMA: str = os.getenv("DB_SCHEMA")
    DB_DRIVER: str = os.getenv("DB_DRIVER")
    
    @property
    def DATABASE_URL(self) -> str:
        return f"{self.DB_DRIVER}://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?options=-csearch_path%3D{self.DB_SCHEMA}"

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