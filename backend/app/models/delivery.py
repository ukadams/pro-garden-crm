from sqlalchemy import Column, Integer, String, Float, Date
from app.core.database import Base

class DeliveryLog(Base):
    __tablename__ = "delivery_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    customer_name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    item_delivered = Column(String, nullable=True)
    quantity = Column(Integer, nullable=True)
    delivery_person = Column(String, nullable=True)
    delivery_cost = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
