from datetime import date
from typing import Optional, List
from pydantic import BaseModel, Field

class InventoryBase(BaseModel):
    item_name: str = Field(..., max_length=100)
    category: Optional[str] = Field(None, max_length=50)
    quantity_in_stock: int = Field(0, ge=0)
    unit: Optional[str] = Field(None, max_length=20)
    cost_price: float = Field(..., ge=0)
    selling_price: float = Field(..., ge=0)
    supplier: Optional[str] = Field(None, max_length=100)
    restock_level: int = Field(5, ge=0)
    status: Optional[str] = Field("In Stock", max_length=20)

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    item_name: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, max_length=50)
    quantity_in_stock: Optional[int] = Field(None, ge=0)
    unit: Optional[str] = Field(None, max_length=20)
    cost_price: Optional[float] = Field(None, ge=0)
    selling_price: Optional[float] = Field(None, ge=0)
    supplier: Optional[str] = Field(None, max_length=100)
    restock_level: Optional[int] = Field(None, ge=0)
    status: Optional[str] = Field(None, max_length=20)

class InventoryResponse(InventoryBase):
    id: int
    status: str
    date_added: date

    class Config:
        from_attributes = True

