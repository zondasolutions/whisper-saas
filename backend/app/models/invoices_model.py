
from tokenize import String

from sqlalchemy import DateTime, Float, Float, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from .base_model import BaseModel

class Invoices(BaseModel):
    __tablename__ = "invoices"
    
    subscription_id: Mapped[int] = mapped_column(UUID, ForeignKey('subscriptions.id'), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default='pending')
    mercadopago_payment_id: Mapped[str] = mapped_column(String(255), nullable=True)
    biling_date: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
    
    subscription = relationship("Subscription", back_populates="invoices")