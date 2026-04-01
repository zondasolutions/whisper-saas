# plan_schema.py
from typing import Optional
from uuid import UUID
from datetime import datetime
from .base_schema import BaseSchema

class PlanResponseSchema(BaseSchema):
    id: UUID
    name: str
    mercadopago_plan_id: str
    price: float
    frequency: int
    frequency_type: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class PlanCreateSchema(BaseSchema):
    name: str
    mercadopago_plan_id: str
    price: float
    frequency: int
    frequency_type: str

class PlanUpdateSchema(BaseSchema):
    name: Optional[str] = None
    price: Optional[float] = None
    frequency: Optional[int] = None
    frequency_type: Optional[str] = None