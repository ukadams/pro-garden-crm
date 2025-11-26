import sys
import getpass
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User
from app.core.Security import hash_password

def create_admin_user():
    db = SessionLocal()
    
    # Check if admin already exists
    admin = db.query(User).filter(User.is_admin == True).first()
    if admin:
        print(f"\nAdmin user already exists: {admin.username}")
        db.close()
        return
    
    print("\n=== Create Admin User ===")
    username = input("Enter admin username: ").strip()
    email = input("Enter admin email: ").strip()
    
    while True:
        password = getpass.getpass("Enter admin password: ").strip()
        confirm_password = getpass.getpass("Confirm admin password: ").strip()
        
        if password != confirm_password:
            print("Passwords do not match. Please try again.")
        elif len(password) < 8:
            print("Password must be at least 8 characters long.")
        else:
            break
    
    # Create admin user
    try:
        hashed_password = hash_password(password)
        admin = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            is_admin=True,
            is_active=True
        )
        db.add(admin)
        db.commit()
        print(f"\n✅ Admin user '{username}' created successfully!")
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error creating admin user: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Setting up admin user...")
    create_admin_user()
