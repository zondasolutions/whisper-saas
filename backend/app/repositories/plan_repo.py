from typing import Any

from sqlalchemy.orm import Session

from ..models.plan_model import Plan
class PlanRepo():
    def __init__(self, db: Session):
        super().__init__(db, Plan)
    
    def create(self, db: Session, *, obj_in: Any):
            pass