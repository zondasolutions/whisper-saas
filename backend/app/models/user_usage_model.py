import uuid
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from .base_model import BaseModel

class UserUsage(BaseModel):
    __tablename__ = "user_usages"
    
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    month_year: Mapped[str] = mapped_column(String(7), nullable=False) # Format: YYYY-MM
    seconds_used: Mapped[int] = mapped_column(Integer, default=0)
    
    user: Mapped["User"] = relationship("User", back_populates="usages")
