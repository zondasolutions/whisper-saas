# user_schema.py
from datetime import datetime
from typing import Optional
from pydantic import EmailStr, Field
from uuid import UUID
from .base_schema import BaseSchema

class UserResponseSchema(BaseSchema):
    id: UUID
    name: str
    email: EmailStr
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

class UserCreateSchema(BaseSchema):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=8)
    is_admin: bool = False

class UserUpdateSchema(BaseSchema):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None