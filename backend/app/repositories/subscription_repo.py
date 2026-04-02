from sqlalchemy.orm import Session
from uuid import UUID
from typing import Any, List

from ..models.subscriptions_model import Subscription




class SubscriptionRepo():
    def __init__(self, db: Session):
        super().__init__(db, Subscription)


    def create(self, db: Session, *, obj_in: Any):
        pass