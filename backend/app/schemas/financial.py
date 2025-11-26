from pydantic import BaseModel
from typing import Optional
from datetime import date

class FinancialRecordBase(BaseModel):
    date: date
    transaction_type: str  # Income or Expense
    description: Optional[str] = None
    category: Optional[str] = None
    amount: float
    payment_method: Optional[str] = None
    status: Optional[str] = "Pending"
    notes: Optional[str] = None
    customer_id: Optional[int] = None

class FinancialRecordCreate(FinancialRecordBase):
    pass

class FinancialRecordUpdate(BaseModel):
    date: Optional[date] = None
    transaction_type: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    payment_method: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    customer_id: Optional[int] = None

class FinancialRecordResponse(FinancialRecordBase):
    id: int
    customer_name: Optional[str] = None  # For display purposes

    class Config:
        from_attributes = True
