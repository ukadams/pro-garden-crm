from sqlalchemy.orm import Session
from app.models.financial import FinancialRecord
from app.schemas.financial import FinancialRecordCreate, FinancialRecordUpdate

def list_records(db: Session):
    return db.query(FinancialRecord).order_by(FinancialRecord.date.desc()).all()

def get_record(db: Session, record_id: int):
    return db.query(FinancialRecord).filter(FinancialRecord.id == record_id).first()

def create_record(db: Session, data: FinancialRecordCreate):
    obj = FinancialRecord(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_record(db: Session, record_id: int, data: FinancialRecordUpdate):
    rec = get_record(db, record_id)
    if not rec:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(rec, k, v)
    db.commit()
    db.refresh(rec)
    return rec

def delete_record(db: Session, record_id: int):
    rec = get_record(db, record_id)
    if not rec:
        return False
    db.delete(rec)
    db.commit()
    return True

# helpers for dashboard:
def total_income(db: Session):
    return db.query(FinancialRecord).filter(FinancialRecord.transaction_type.ilike("income")).with_entities(
        func.coalesce(func.sum(FinancialRecord.amount), 0)
    ).scalar()

def total_expense(db: Session):
    return db.query(FinancialRecord).filter(FinancialRecord.transaction_type.ilike("expense")).with_entities(
        func.coalesce(func.sum(FinancialRecord.amount), 0)
    ).scalar()
