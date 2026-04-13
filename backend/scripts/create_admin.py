import sys
import os
from pathlib import Path

# Add the parent directory to sys.path to allow imports from 'app'
# This assumes the script is inside backend/scripts/
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.core.db import SessionLocal
from app.models.user_model import User
from app.utils.security import get_password_hash

def create_admin(email, name, password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists. Updating to admin and updating credentials...")
            user.is_admin = True
            user.name = name
            user.password_hash = get_password_hash(password)
        else:
            print(f"Creating new admin user: {email}")
            user = User(
                email=email,
                name=name,
                password_hash=get_password_hash(password),
                is_admin=True,
                is_active=True
            )
            db.add(user)
        db.commit()
        print(f"Successfully created/updated admin user: {email}")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python scripts/create_admin.py <email> <name> <password>")
    else:
        create_admin(sys.argv[1], sys.argv[2], sys.argv[3])
