# base_schema.py
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class BaseSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )