# subscription_schema.py
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import EmailStr
from uuid import UUID
from .base_schema import BaseSchema

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class SubResponseSchema(BaseSchema):
    id: UUID
    user_id: UUID
    plan_id: UUID
    mercadopago_preapproval_id: Optional[str] = None
    status: SubscriptionStatus
    discount_applied: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

class SubCreateSchema(BaseSchema):
    card_token: str
    plan_id: UUID
    payer_email: EmailStr

class SubUpdateSchema(BaseSchema):
    status: Optional[SubscriptionStatus] = None
    discount_applied: Optional[bool] = None
    mercadopago_preapproval_id: Optional[str] = None