from pydantic import BaseModel
from typing import Optional

class DeliveryLogBase(BaseModel):
    date: str
    customer_name: str
    location: Optional[str] = None
    item_delivered: Optional[str] = None
    quantity: Optional[int] = None
    delivery_person: Optional[str] = None
    delivery_cost: Optional[float] = None
    notes: Optional[str] = None

class DeliveryLogCreate(DeliveryLogBase):
    pass

class DeliveryLogUpdate(BaseModel):
    date: Optional[str] = None
    customer_name: Optional[str] = None
    location: Optional[str] = None
    item_delivered: Optional[str] = None
    quantity: Optional[int] = None
    delivery_person: Optional[str] = None
    delivery_cost: Optional[float] = None
    notes: Optional[str] = None

class DeliveryLogResponse(DeliveryLogBase):
    id: int

    class Config:
        from_attributes = True
