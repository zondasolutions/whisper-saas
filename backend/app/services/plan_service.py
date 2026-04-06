from ..repositories.plan_repo import PlanRepo
from uuid import UUID

class PlanService:
    def __init__(self, plan_repo: PlanRepo):
        self.plan_repo = plan_repo

    def get_all_plans(self):
        return self.plan_repo.get_all()

    def get_plan_by_id(self, plan_id: UUID):
        return self.plan_repo.get_by_id(plan_id)

    def create_plan(self, plan_data):
        return self.plan_repo.create(obj_in=plan_data)
    def update_plan(self, plan_id: UUID, plan_data):
        return self.plan_repo.update(plan_id, plan_data)

    def delete_plan(self, plan_id: UUID):
        return self.plan_repo.delete(plan_id)