
from .base_model import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import DateTime, ForeignKey, String, Boolean, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.ext.associationproxy import association_proxy

class Subscription(BaseModel):
    __tablename__ = "subscriptions"
    
    user_id: Mapped[int] = mapped_column(UUID, ForeignKey('users.id'), nullable=False)
    plan_id: Mapped[str] = mapped_column(String(50), nullable=False)
    start_date: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    end_date: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
    mercadopago_preapproval_id: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default='active')
    discount_applied: Mapped[bool] = mapped_column(Boolean, default=False)
    
    
    user = relationship("User", back_populates="subscriptions")
