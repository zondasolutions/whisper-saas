from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.db import get_db_session
from app.models.user_model import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Fallback secret key just for MVP if not set. In production should be safely generated
SECRET_KEY = getattr(settings, "SECRET_KEY", "b4ac-8b275e86ed86-whisper-saas")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    db: Session = Depends(get_db_session),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_user_optional(
    db: Session = Depends(get_db_session),
    token: str = Depends(OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False))
) -> Union[User, None]:
    if not token:
        return None
    try:
        user = get_current_user(db, token)
        return user
    except HTTPException:
        return None
