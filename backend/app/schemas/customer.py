from pydantic import BaseModel
from typing import Optional
from datetime import date

class CustomerBase(BaseModel):
    customer_name: str
    phone_number: str
    address: Optional[str] = None
    product_purchased: Optional[str] = None
    quantity: Optional[int] = 0
    total_amount: Optional[float] = 0.0
    purchase_date: Optional[date] = None
    payment_status: Optional[str] = "Pending"
    payment_method: Optional[str] = None
    delivery_status: Optional[str] = "Pending"
    notes: Optional[str] = None
    customer_type: Optional[str] = "New"
    channel: Optional[str] = None
    preferred_product: Optional[str] = None
    follow_up_date: Optional[date] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    customer_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    product_purchased: Optional[str] = None
    quantity: Optional[int] = None
    total_amount: Optional[float] = None
    purchase_date: Optional[date] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    delivery_status: Optional[str] = None
    notes: Optional[str] = None
    customer_type: Optional[str] = None
    channel: Optional[str] = None
    preferred_product: Optional[str] = None
    follow_up_date: Optional[date] = None

class CustomerResponse(CustomerBase):
    id: int

    class Config:
        from_attributes = True

