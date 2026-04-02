from sqlalchemy.orm import Session
from uuid import UUID
from typing import Any, List

from ..schemas.invoice_schema import InvoiceResponseSchema
from ..models.invoices_model import Invoice

class InvoiceRepo():
    def __init__(self, db: Session, invoice_model: Invoice):
        self.__model = invoice_model
        self.__db = db


    def create(self, db: Session, *, obj_in: Any):
        pass

    #Get Methods
    def find_by_id(self, id: UUID) -> InvoiceResponseSchema:
        return self.__db.query(self.__model).filter(self.__model.id == id).first()
    
    def find_all(self) -> List[InvoiceResponseSchema]:
        return self.__db.query(self.__model).all()