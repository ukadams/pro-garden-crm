from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


def list_customers(db: Session):
    return db.query(Customer).all()

def get_customer(db: Session, customer_id: int):
    return db.query(Customer).filter(Customer.id == customer_id).first()

def create_customer(db: Session, data: CustomerCreate):
    obj = Customer(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_customer(db: Session, customer_id: int, data: CustomerUpdate):
    customer = get_customer(db, customer_id)
    if not customer:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(customer, k, v)
    db.commit()
    db.refresh(customer)
    return customer

def delete_customer(db: Session, customer_id: int):
    customer = get_customer(db, customer_id)
    if not customer:
        return False
    db.delete(customer)
    db.commit()
    return True
