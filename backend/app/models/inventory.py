from sqlalchemy import Column, Integer, String, Float, Date, Numeric
from sqlalchemy.sql import func
from datetime import date
from typing import Optional
from app.core.database import Base

class Inventory(Base):
    """
    Represents an inventory item in the system.
    
    Attributes:
        id (int): Primary key
        item_name (str): Name of the inventory item
        category (Optional[str]): Category of the item (e.g., 'Seeds', 'Tools')
        quantity_in_stock (int): Current quantity in stock
        unit (Optional[str]): Unit of measurement (e.g., 'kg', 'pieces')
        cost_price (float): Cost price per unit
        selling_price (float): Selling price per unit
        supplier (Optional[str]): Name of the supplier
        restock_level (int): Minimum stock level before restock is needed
        status (str): Current stock status ('In Stock', 'Low Stock', 'Out of Stock')
        date_added (date): Date when the item was added to inventory
    """
    __tablename__ = "inventory"
    __table_args__ = {
        "extend_existing": True,  # Avoids "table already defined" error
        "comment": "Stores inventory items and their details"
    }

    id: int = Column(Integer, primary_key=True, index=True)
    item_name: str = Column(String(100), nullable=False, index=True)
    category: Optional[str] = Column(String(50), nullable=True, index=True)
    quantity_in_stock: int = Column(Integer, nullable=False, default=0)
    unit: Optional[str] = Column(String(20), nullable=True)
    cost_price: float = Column(Numeric(10, 2), nullable=False)
    selling_price: float = Column(Numeric(10, 2), nullable=False)
    supplier: Optional[str] = Column(String(100), nullable=True)
    restock_level: int = Column(Integer, nullable=False, default=5)
    status: str = Column(
        String(20), 
        nullable=False, 
        default="In Stock",
        server_default="In Stock"
    )
    date_added: date = Column(
        Date, 
        nullable=False, 
        server_default=func.current_date()
    )

    def __repr__(self) -> str:
        return f"<Inventory {self.item_name} (ID: {self.id})>"

    @property
    def needs_restock(self) -> bool:
        """Check if the item needs to be restocked."""
        return self.quantity_in_stock <= self.restock_level

    def update_status(self) -> None:
        """Update the status based on current stock level."""
        if self.quantity_in_stock <= 0:
            self.status = "Out of Stock"
        elif self.quantity_in_stock <= self.restock_level:
            self.status = "Low Stock"
        else:
            self.status = "In Stock"

