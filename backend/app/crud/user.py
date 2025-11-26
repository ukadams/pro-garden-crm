from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password

def get_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create(db: Session, data: UserCreate):
    hashed = hash_password(data.password)
    user = User(username=data.username, email=data.email, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update(db: Session, user_id: int, data: UserUpdate):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    update_data = data.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        update_data["password"] = hash_password(update_data["password"])
    for k, v in update_data.items():
        setattr(user, k, v)
    db.commit()
    db.refresh(user)
    return user

def delete(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True
