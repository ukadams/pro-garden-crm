from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.core.security import hash_password

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        admin = db.query(User).filter(User.is_admin == True).first()
        if not admin:
            # Create default admin user
            admin_user = User(
                username="admin",
                email="admin@progarden.com",
                hashed_password=hash_password("admin123"),
                is_admin=True,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("✅ Database initialized with admin user (username: admin, password: admin123)")
        else:
            print("ℹ️  Database already initialized with admin user")
    except Exception as e:
        db.rollback()
        print(f"❌ Error initializing database: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
