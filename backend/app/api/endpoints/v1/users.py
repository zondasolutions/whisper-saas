# routers/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from ....models.user_model import User
from ....core.db import get_db_session as get_db
from ....services.user_service import UserService
from ....repositories.user_repo import UserRepo
from ....schemas.user_schema import UserCreateSchema, UserUpdateSchema, UserResponseSchema

user_router = APIRouter(prefix="/users")

def get_user_repo(db: Session = Depends(get_db)) -> UserRepo:
    return UserRepo(db)

def get_user_service(user_repo: UserRepo = Depends(get_user_repo)) -> UserService:
    return UserService(user_repo)
@user_router.post("/", response_model=UserResponseSchema, status_code=201)
async def create_user(
    user_data: UserCreateSchema,
    user_service: UserService = Depends(get_user_service)
) -> UserResponseSchema:
    return user_service.create_user(user_data)

@user_router.patch("/{user_id}", response_model=UserResponseSchema)
async def update_user(
    user_id: UUID,
    data: UserUpdateSchema,
    user_service: UserService = Depends(get_user_service),
) -> UserResponseSchema:
    return user_service.update_user(user_id, data)

@user_router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: UUID,
    user_service: UserService = Depends(get_user_service),
) -> None:
    user_service.delete_user(user_id)

@user_router.get("/", response_model=list[UserResponseSchema])
async def get_all_users(
    user_service: UserService = Depends(get_user_service),
) -> list[UserResponseSchema]:
    return user_service.find_all()

@user_router.get("/{user_id}", response_model=UserResponseSchema)
async def get_user(
    user_id: UUID,
    user_service: UserService = Depends(get_user_service),
) -> UserResponseSchema:
    return user_service.find_by_id(user_id)