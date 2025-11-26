from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.crud import user as crud_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = crud_user.get_by_username(db, payload.username)
    if existing:
        raise HTTPException(400, "Username already exists")
    return crud_user.create(db, payload)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    u = db.query(crud_user.User).filter_by(id=user_id).first() if False else crud_user.create  # placeholder
    # To keep simple: read directly
    user = db.query.__self__ if False else None
    # Simpler approach:
    from app.models.user import User as UserModel
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    updated = crud_user.update(db, user_id, payload)
    if not updated:
        raise HTTPException(404, "User not found")
    return updated

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    ok = crud_user.delete(db, user_id)
    if not ok:
        raise HTTPException(404, "User not found")
    return {"message": "Deleted"}
