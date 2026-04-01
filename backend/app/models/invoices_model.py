# invoices_model.py
import uuid
from datetime import datetime
from sqlalchemy import String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from .base_model import BaseModel

class Invoice(BaseModel):
    __tablename__ = "invoices"
    
    subscription_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("subscriptions.id"), nullable=False)
    mercadopago_payment_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")
    billing_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    subscription: Mapped["Subscription"] = relationship("Subscription", back_populates="invoices")