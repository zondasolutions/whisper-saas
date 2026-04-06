# plan_schema.py
from typing import Optional
from uuid import UUID
from datetime import datetime
from .base_schema import BaseSchema
from decimal import Decimal
class PlanResponseSchema(BaseSchema):
    id: UUID
    name: str
    mercadopago_plan_id: str
    price: Decimal
    frequency: int
    frequency_type: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class PlanCreateSchema(BaseSchema):
    name: str
    mercadopago_plan_id: str
    price: Decimal
    frequency: int
    frequency_type: str

class PlanUpdateSchema(BaseSchema):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    plan_details: Optional[dict] = None
    frequency: Optional[int] = None
    frequency_type: Optional[str] = None