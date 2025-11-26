from app.core.database import Base, engine
from app.models import user, inventory, customer, financial, supplier, delivery, marketing
from app.routers.inventory import InventoryItem


print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully.")
