from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.crud.user import get_by_username, create
from app.schemas.user import UserCreate
import sys

def seed_admin():
    db: Session = SessionLocal()
    try:
        username = "theprogarden@gmail.com"
        email = "theprogarden@gmail.com"
        password = "ChidiandFaiza123"
        
        # Check if user exists
        user = get_by_username(db, username)
        if user:
            print(f"Admin user {username} already exists.")
            return
        
        # Create admin user
        admin_data = UserCreate(
            username=username,
            email=email,
            password=password,
            is_admin=True
        )
        
        new_admin = create(db, admin_data)
        # Manually set is_admin to True since UserCreate might not have it or create might not set it
        new_admin.is_admin = True
        new_admin.email = email
        db.commit()
        
        print(f"Successfully created admin user: {username}")
        
    except Exception as e:
        print(f"Error seeding admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
