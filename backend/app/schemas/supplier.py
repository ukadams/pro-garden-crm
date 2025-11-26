from pydantic import BaseModel
from typing import Optional
from datetime import date

class SupplierBase(BaseModel):
    supplier_name: str
    product_supplied: Optional[str] = None
    contact: Optional[str] = None
    payment_terms: Optional[str] = None
    last_purchase: Optional[date] = None
    amount_paid: Optional[float] = 0.0
    balance: Optional[float] = 0.0
    notes: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    supplier_name: Optional[str] = None
    product_supplied: Optional[str] = None
    contact: Optional[str] = None
    payment_terms: Optional[str] = None
    last_purchase: Optional[date] = None
    amount_paid: Optional[float] = None
    balance: Optional[float] = None
    notes: Optional[str] = None

class SupplierResponse(SupplierBase):
    id: int

    class Config:
        from_attributes = True
