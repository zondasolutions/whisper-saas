# user_model.py
from sqlalchemy import String, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .base_model import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    
    subscriptions: Mapped[list["Subscription"]] = relationship("Subscription", back_populates="user")
    usages: Mapped[list["UserUsage"]] = relationship("UserUsage", back_populates="user")