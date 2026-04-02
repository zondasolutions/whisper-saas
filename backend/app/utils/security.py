from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

from typing import Optional

def verify_password(plain_password: str, hashed_password: Optional[str]) -> bool:
    if not hashed_password:
        return False
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False

def get_password_hash(password: str) -> str:
    return ph.hash(password)
