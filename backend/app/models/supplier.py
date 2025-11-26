from sqlalchemy import Column, Integer, String, Float, Date
from app.core.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    supplier_name = Column(String, nullable=False)
    product_supplied = Column(String, nullable=True)
    contact = Column(String, nullable=True)
    payment_terms = Column(String, nullable=True)
    last_purchase = Column(Date, nullable=True)
    amount_paid = Column(Float, nullable=True)
    balance = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
