# plan_model.py
import uuid
from sqlalchemy import String, Numeric, Integer
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from .base_model import BaseModel

class Plan(BaseModel):
    __tablename__ = "plans"
    
    mercadopago_plan_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    frequency: Mapped[int] = mapped_column(Integer, nullable=False)
    frequency_type: Mapped[str] = mapped_column(String(50), nullable=False)
    
    subscriptions: Mapped[list["Subscription"]] = relationship("Subscription", back_populates="plan")