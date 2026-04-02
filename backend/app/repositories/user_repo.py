from sqlalchemy.orm import Session

from typing import List

from ..schemas.user_schema import UserResponseSchema, UserCreateSchema, UserUpdateSchema
from ..utils.security import get_password_hash
from ..models.user_model import User

from uuid import UUID
from typing import Any


class UserRepo:
    def __init__(self, db: Session):
        self.__model = User
        self.__db = db


    def create(self, *, obj_in: UserCreateSchema) -> User:
        """
        Crea un nuevo usuario en la base de datos.
        """
        create_data = obj_in.model_dump(exclude={"password"}) # Excluimos password plana
        
        db_user = User(
            **create_data,
            password_hash=get_password_hash(obj_in.password) if obj_in.password else None
        )
        
        self.__db.add(db_user)
        self.__db.commit()
        self.__db.refresh(db_user)
        return db_user
    
    #Get Methods
    def find_by_id(self, id: UUID) -> UserResponseSchema:
        """
        Busca un usuario por su ID en la base de datos.
        """
        return self.__db.query(self.__model).filter(self.__model.id == id).first()
    
    def find_all(self) -> List[UserResponseSchema]:
        """
        Busca todos los usuarios en la base de datos.
        """
        return self.__db.query(self.__model).all()
    
    def email_exists(self, email: str) -> bool:
        """
        Verifica si un email ya está registrado en la base de datos.
        """
        return self.__db.query(self.__model).filter(self.__model.email == email).first() is not None
    
    #Update Method
    def update(self, *, db_obj: User, obj_in: UserUpdateSchema) -> UserResponseSchema:
        """
        Actualiza un usuario existente en la base de datos.
        """
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        self.__db.add(db_obj)
        self.__db.commit()
        self.__db.refresh(db_obj)
        return UserResponseSchema.model_validate(db_obj)
    
    #Delete Method
    def delete(self, id: UUID)-> UserResponseSchema:
        """
        Elimina un usuario de la base de datos.
        """
        db_obj = self.find_by_id(id)
        
        self.__db.delete(db_obj)
        self.__db.commit()
        return UserResponseSchema.model_validate(db_obj)