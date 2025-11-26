from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryUpdate, InventoryBase


# -------------------------------------------------------------------
# ROUTER
# -------------------------------------------------------------------
router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


# -------------------------------------------------------------------
# CREATE ITEM
# -------------------------------------------------------------------
@router.post("/", response_model=InventoryBase, status_code=status.HTTP_201_CREATED)
def create_item(data: InventoryCreate, db: Session = Depends(get_db)):
    item = Inventory(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# -------------------------------------------------------------------
# LIST ALL ITEMS
# -------------------------------------------------------------------
@router.get("/", response_model=List[InventoryBase])
def list_items(db: Session = Depends(get_db)):
    return db.query(Inventory).all()


# -------------------------------------------------------------------
# GET SINGLE ITEM
# -------------------------------------------------------------------
@router.get("/{item_id}", response_model=InventoryBase)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


# -------------------------------------------------------------------
# UPDATE ITEM
# -------------------------------------------------------------------
@router.put("/{item_id}", response_model=InventoryBase)
def update_item(item_id: int, data: InventoryUpdate, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


# -------------------------------------------------------------------
# DELETE ITEM
# -------------------------------------------------------------------
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    db.delete(item)
    db.commit()
    return None
