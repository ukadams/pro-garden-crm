from sqlalchemy.orm import Session
from app.models.delivery import DeliveryLog
from app.schemas.delivery import DeliveryLogCreate, DeliveryLogUpdate
from datetime import datetime

def list_deliveries(db: Session):
    return db.query(DeliveryLog).order_by(DeliveryLog.date.desc()).all()

def get_delivery(db: Session, delivery_id: int):
    return db.query(DeliveryLog).filter(DeliveryLog.id == delivery_id).first()

def create_delivery(db: Session, data: DeliveryLogCreate):
    data_dict = data.model_dump()
    # Convert date string to date object
    if isinstance(data_dict.get('date'), str):
        data_dict['date'] = datetime.strptime(data_dict['date'], '%Y-%m-%d').date()
    obj = DeliveryLog(**data_dict)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_delivery(db: Session, delivery_id: int, data: DeliveryLogUpdate):
    d = get_delivery(db, delivery_id)
    if not d:
        return None
    update_dict = data.model_dump(exclude_unset=True)
    # Convert date string to date object if present
    if 'date' in update_dict and isinstance(update_dict['date'], str):
        update_dict['date'] = datetime.strptime(update_dict['date'], '%Y-%m-%d').date()
    for k, v in update_dict.items():
        setattr(d, k, v)
    db.commit()
    db.refresh(d)
    return d

def delete_delivery(db: Session, delivery_id: int):
    d = get_delivery(db, delivery_id)
    if not d:
        return False
    db.delete(d)
    db.commit()
    return True
