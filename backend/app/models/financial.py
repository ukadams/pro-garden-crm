from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class FinancialRecord(Base):
    __tablename__ = "financial_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    transaction_type = Column(String, nullable=False)  # Income or Expense
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=True)
    status = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=True)
    
    # Relationship
    customer = relationship("Customer", backref="financial_records")
