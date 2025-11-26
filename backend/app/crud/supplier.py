from sqlalchemy.orm import Session
from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate

def list_suppliers(db: Session):
    return db.query(Supplier).all()

def get_supplier(db: Session, supplier_id: int):
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

def create_supplier(db: Session, data: SupplierCreate):
    obj = Supplier(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_supplier(db: Session, supplier_id: int, data: SupplierUpdate):
    s = get_supplier(db, supplier_id)
    if not s:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s

def delete_supplier(db: Session, supplier_id: int):
    s = get_supplier(db, supplier_id)
    if not s:
        return False
    db.delete(s)
    db.commit()
    return True
