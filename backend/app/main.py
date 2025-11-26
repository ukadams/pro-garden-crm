from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.routers import inventory, customer, financial, supplier, delivery, marketing, auth, dashboard
from app.core.security import get_current_active_admin, get_current_user
from app.core.database import engine
from app.models import customer as customer_model, inventory as inventory_model, financial as financial_model, supplier as supplier_model, delivery as delivery_model, marketing as marketing_model, user as user_model

# Create all tables in the database
customer_model.Base.metadata.create_all(bind=engine)
inventory_model.Base.metadata.create_all(bind=engine)
financial_model.Base.metadata.create_all(bind=engine)
supplier_model.Base.metadata.create_all(bind=engine)
delivery_model.Base.metadata.create_all(bind=engine)
marketing_model.Base.metadata.create_all(bind=engine)
user_model.Base.metadata.create_all(bind=engine)


app = FastAPI(title="Pro Garden CRM API", version="1.0")

# CORS - allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(inventory.router)
app.include_router(customer.router)
app.include_router(financial.router)
app.include_router(supplier.router)
app.include_router(delivery.router)
app.include_router(marketing.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Pro Garden CRM Backend Running"}

# Test protected routes
@app.get("/test-auth")
async def test_auth(current_user = Depends(get_current_user)):
    return {"message": "You are authenticated", "user": current_user.username}

@app.get("/test-admin")
async def test_admin(current_user = Depends(get_current_active_admin)):
    return {"message": "Admin access granted", "user": current_user.username}
