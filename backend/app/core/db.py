from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv
from pathlib import Path
from urllib.parse import quote_plus
from loguru import logger as log
from ..core.config import settings


Base = declarative_base()

engine = create_engine(
    settings.DATABASE_URL, 
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)
