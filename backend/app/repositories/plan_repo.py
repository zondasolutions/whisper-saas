from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..schemas.plan_schema import PlanCreateSchema, PlanResponseSchema
from ..models.plan_model import Plan
from ..exceptions.http_exceptions import ConflictError, RouteNotFoundError, BadRequestError
from loguru import logger as log


class PlanRepo():
    def __init__(self, db: Session):
        self.__model = Plan
        self.__db = db
    
    def create(self, *, obj_in: PlanCreateSchema) -> Plan:
        create_data = obj_in.model_dump()
        db_plan = Plan(**create_data)
        self.__db.add(db_plan)
        try:
            self.__db.commit()
            self.__db.refresh(db_plan)
        except IntegrityError as e:
            self.__db.rollback()
            log.error(f"[PlanRepo.create] IntegrityError | data={create_data} | orig={e.orig}")
            raise ConflictError(detail="Plan Repo says: Plan creation failed. Possible duplicate or invalid data.")
        return db_plan
    
    def get_all(self) -> list[Plan]:
        """
        Obtiene todos los planes de subscripción de la base de datos.
        """

        return self.__db.query(self.__model).all()
    
    def get_by_id(self, id: UUID) -> Plan:
        plan = self.__db.query(self.__model).filter(self.__model.id == id).first()
        if not plan:
            log.warning(f"[PlanRepo.get_by_id] Plan not found | id={id}")
            raise RouteNotFoundError(detail="Plan not found.")
        return plan
    
    def update(self, id: UUID, obj_in: PlanCreateSchema) -> Plan:
        db_plan = self.get_by_id(id)
        update_data = obj_in.model_dump(exclude_unset=True)
        if not update_data:
            log.warning(f"[PlanRepo.update] No fields provided | id={id}")
            raise BadRequestError(detail="No valid fields provided for update.")
        for field, value in update_data.items():
            setattr(db_plan, field, value)
        try:
            self.__db.commit()
            self.__db.refresh(db_plan)
        except IntegrityError as e:
            self.__db.rollback()
            log.error(f"[PlanRepo.update] IntegrityError | id={id} | data={update_data} | orig={e.orig}")
            raise ConflictError(detail="Plan update failed due to a conflict.")
        return db_plan
    
    def delete(self, id: UUID) -> PlanResponseSchema:
        """
        Elimina un plan de subscripción de la base de datos.
        """
        if not id:
            raise RouteNotFoundError(detail=f"Plan Repo says: Invalid ID provided or missing id, delete failed")
        db_plan = self.get_by_id(id)
        if not db_plan:
            raise BadRequestError(detail=f"Plan Repo says: delete failed")
        self.__db.delete(db_plan)
        self.__db.commit()
        return db_plan