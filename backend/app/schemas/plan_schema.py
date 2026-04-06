# plan_schema.py
from typing import Optional
from pydantic import BaseModel
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
    plan_details: Optional[PlanDetailSchema] = None 
    frequency_type: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class PlanCreateSchema(BaseSchema):
    name: str
    mercadopago_plan_id: str
    plan_details: Optional[PlanDetailSchema] = None
    price: Decimal
    frequency: int
    frequency_type: str

class PlanUpdateSchema(BaseSchema):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    plan_details: Optional[PlanDetailSchema] = None
    frequency: Optional[int] = None
    frequency_type: Optional[str] = None

class PlanFeaturesSchema(BaseModel):
    export_txt: bool
    export_pdf: bool
    export_srt: bool
    speaker_detection: bool
    priority_queue: bool
    api_access: bool

class PlanDetailSchema(BaseModel):
    max_minutes_per_month: int
    max_file_size_mb: int
    max_files_per_month: int
    allowed_formats: list[str]
    transcription_languages: list[str]
    features: PlanFeaturesSchema