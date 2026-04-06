# routers/plans.py
from fastapi import APIRouter, Depends
from uuid import UUID
from sqlalchemy.orm import Session

from ....core.db import get_db_session as get_db
from ....repositories.plan_repo import PlanRepo
from ....schemas.plan_schema import PlanCreateSchema, PlanUpdateSchema, PlanResponseSchema
from ....services.plan_service import PlanService


plan_router = APIRouter(prefix="/plans", tags=["plans"])


def get_plan_repo(db: Session = Depends(get_db)) -> PlanRepo:
    return PlanRepo(db)

def get_plan_service(plan_repo: PlanRepo = Depends(get_plan_repo)) -> PlanService:
    return PlanService(plan_repo)


@plan_router.get("/", response_model=list[PlanResponseSchema])
async def get_all_plans(
    plan_service: PlanService = Depends(get_plan_service)
)-> list[PlanResponseSchema]:
    return plan_service.get_all_plans()

@plan_router.get("/{plan_id}", response_model=PlanResponseSchema)
async def get_plan(
    plan_id: UUID,
    plan_service: PlanService = Depends(get_plan_service)
    ) -> PlanResponseSchema:
    return plan_service.get_plan_by_id(plan_id)

@plan_router.post("/", response_model=PlanResponseSchema, status_code=201)
async def create_plan(
    plan_data: PlanCreateSchema,
    plan_service: PlanService = Depends(get_plan_service)
) -> PlanResponseSchema:
    return plan_service.create_plan(plan_data)

@plan_router.patch("/{plan_id}", response_model=PlanResponseSchema)
async def update_plan(
    plan_id: UUID,
    data: PlanUpdateSchema,
    plan_service: PlanService = Depends(get_plan_service)
):
    return plan_service.update_plan(plan_id, data)

@plan_router.delete("/{plan_id}", status_code=204)
async def delete_plan(
    plan_id: UUID,
    plan_service: PlanService = Depends(get_plan_service)
):
    return plan_service.delete_plan(plan_id)