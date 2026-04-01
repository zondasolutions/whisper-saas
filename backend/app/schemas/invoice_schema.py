# invoice_schema.py
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID
from .base_schema import BaseSchema

class InvoiceStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REFUNDED = "refunded"

class InvoiceResponseSchema(BaseSchema):
    id: UUID
    subscription_id: UUID
    amount: float
    status: InvoiceStatus
    mercadopago_payment_id: Optional[str] = None
    billing_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class InvoiceCreateSchema(BaseSchema):
    subscription_id: UUID
    amount: float
    mercadopago_payment_id: Optional[str] = None
    billing_date: Optional[datetime] = None

class InvoiceUpdateSchema(BaseSchema):
    status: Optional[InvoiceStatus] = None
    mercadopago_payment_id: Optional[str] = None
    billing_date: Optional[datetime] = None