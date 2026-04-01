from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import relationship, Mapped, mapped_column

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from ..core.db import Base

class BaseModel(Base):
    __abstract__ = True
    """Clase base para todos los modelos de la base de datos"""
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[Optional[datetime]] = mapped_column(onupdate=func.now())