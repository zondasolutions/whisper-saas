from ..repositories.user_repo import UserRepo
from uuid import UUID

from ..exceptions import ConflictError, BadRequestError, RouteNotFoundError

class UserService:
    def __init__(self, user_repo: UserRepo):
        self.__user_repo = user_repo

    def find_all(self):
        return self.__user_repo.find_all()
    
    def find_by_id(self, id: UUID):
        user = self.__user_repo.find_by_id(id)
        if not user:
            raise RouteNotFoundError(detail=f"UserService says: User with ID '{id}' not found.")
        return user
    
    def email_exists(self,  email: str) -> bool:
        return self.__user_repo.email_exists(email)

    def create_user(self, user_data):
        if self.email_exists( user_data.email):
            raise ConflictError(detail=f"UserService says: Email '{user_data.email}' already exists.")
        user = self.__user_repo.create(obj_in=user_data)
        if not user:
            raise BadRequestError(detail="UserService says: Failed to create user.")
        return user
    
    def update_user(self, user_id: UUID, user_data):
        existing_user = self.__user_repo.find_by_id(user_id)        
        if not existing_user:
            raise RouteNotFoundError(detail=f"UserService says: User with ID '{user_id}' not found.")
        if user_data.email and user_data.email != existing_user.email:
            if self.email_exists(user_data.email):
                raise BadRequestError(detail="User Service says: Email already exists for another user.")
        updated_user = self.__user_repo.update(db_obj=existing_user, obj_in=user_data)        
        if not updated_user:
            raise BadRequestError(detail="UserService says: Failed to update user.")
        return updated_user
    def delete_user(self, user_id: UUID):
        existing_user = self.__user_repo.find_by_id(id=user_id)
        if not existing_user:
            raise RouteNotFoundError(detail=f"UserService says: User with ID '{user_id}' not found.")
        success = self.__user_repo.delete(user_id)
        if not success:
            raise BadRequestError(detail="UserService says: Failed to delete user.")