import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

# Set up environment
os.environ["PYTHONPATH"] = str(Path(__file__).parent)

# Import after setting up path
from app.core.database import Base, engine, SessionLocal
from app.models.user import User
from app.core.Security import hash_password

def init_db():
    print("Initializing database...")
    
    try:
        # Create all tables
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Create a database session
        db = SessionLocal()
        
        try:
            # Check if admin user already exists
            admin = db.query(User).filter(User.username == "admin").first()
            if not admin:
                print("Creating admin user...")
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
                print("✅ Admin user created successfully!")
                print("   Username: admin")
                print("   Password: admin123")
                print("\n❗ Please change the default password after first login!")
            else:
                print("ℹ️  Admin user already exists")
        except Exception as e:
            db.rollback()
            print(f"❌ Error creating admin user: {str(e)}")
            raise
        finally:
            db.close()
    except Exception as e:
        print(f"❌ Error initializing database: {str(e)}")
        raise

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization complete!")
