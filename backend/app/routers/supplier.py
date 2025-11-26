from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.supplier import SupplierCreate, SupplierResponse, SupplierUpdate
from app.crud import supplier as crud_supplier

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.get("/", response_model=list[SupplierResponse])
def list_suppliers(db: Session = Depends(get_db)):
    return crud_supplier.list_suppliers(db)

@router.post("/", response_model=SupplierResponse)
def create_supplier(payload: SupplierCreate, db: Session = Depends(get_db)):
    return crud_supplier.create_supplier(db, payload)

@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    s = crud_supplier.get_supplier(db, supplier_id)
    if not s:
        raise HTTPException(404, "Supplier not found")
    return s

@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(supplier_id: int, payload: SupplierUpdate, db: Session = Depends(get_db)):
    updated = crud_supplier.update_supplier(db, supplier_id, payload)
    if not updated:
        raise HTTPException(404, "Supplier not found")
    return updated

@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    ok = crud_supplier.delete_supplier(db, supplier_id)
    if not ok:
        raise HTTPException(404, "Supplier not found")
    return {"message": "Deleted"}
