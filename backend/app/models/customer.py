from sqlalchemy import Column, Integer, String, Float, Date
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    address = Column(String, nullable=True)
    product_purchased = Column(String, nullable=True)
    quantity = Column(Integer, nullable=True, default=0)
    total_amount = Column(Float, nullable=True, default=0.0)
    purchase_date = Column(Date, nullable=True)
    payment_status = Column(String, nullable=True, default="Pending")
    payment_method = Column(String, nullable=True)
    delivery_status = Column(String, nullable=True, default="Pending")
    notes = Column(String, nullable=True)
    customer_type = Column(String, nullable=True, default="New")
    channel = Column(String, nullable=True)
    preferred_product = Column(String, nullable=True)
    follow_up_date = Column(Date, nullable=True)

