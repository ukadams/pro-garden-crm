from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..schemas.customer import CustomerCreate, CustomerResponse, CustomerUpdate
from ..crud import customer as crud_customer
from ..crud import financial as crud_financial
from ..schemas.financial import FinancialRecordCreate, FinancialRecordUpdate
from datetime import date

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/", response_model=list[CustomerResponse])
def list_customers(db: Session = Depends(get_db)):
    return crud_customer.list_customers(db)

@router.post("/", response_model=CustomerResponse)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    customer = crud_customer.create_customer(db, payload)
    
    # Automatically create financial record if amount > 0
    if (customer.total_amount or 0) > 0:
        financial_data = FinancialRecordCreate(
            date=customer.purchase_date or date.today(),
            transaction_type="Income",
            description=f"Sale to {customer.customer_name} - {customer.product_purchased or 'Product'}",
            category="Sales",
            amount=customer.total_amount,
            payment_method=customer.payment_method,
            status=customer.payment_status or "Pending",
            notes=customer.notes,
            customer_id=customer.id
        )
        crud_financial.create_record(db, financial_data)
        
    return customer

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    c = crud_customer.get_customer(db, customer_id)
    if not c:
        raise HTTPException(404, "Customer not found")
    return c

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: int, payload: CustomerUpdate, db: Session = Depends(get_db)):
    updated_customer = crud_customer.update_customer(db, customer_id, payload)
    if not updated_customer:
        raise HTTPException(404, "Customer not found")
        
    # Sync with financial record
    # Find existing financial record for this customer
    # Note: This assumes one financial record per customer for now, or updates the latest one
    # A better approach might be to store financial_record_id on customer, but we have customer_id on financial_record
    
    # We need a way to find financial record by customer_id. 
    # Let's add a helper in crud_financial or just query here if simple.
    # For now, let's try to find one and update it.
    
    existing_records = db.query(crud_financial.FinancialRecord).filter(
        crud_financial.FinancialRecord.customer_id == customer_id
    ).all()
    
    if existing_records:
        # Update the most recent one or all? Let's update the most recent one
        record = existing_records[-1] # Assuming order by id or date
        
        update_data = FinancialRecordUpdate(
            date=updated_customer.purchase_date,
            description=f"Sale to {updated_customer.customer_name} - {updated_customer.product_purchased or 'Product'}",
            amount=updated_customer.total_amount,
            payment_method=updated_customer.payment_method,
            status=updated_customer.payment_status,
            notes=updated_customer.notes
        )
        crud_financial.update_record(db, record.id, update_data)
    elif (updated_customer.total_amount or 0) > 0:
        # Create if not exists and amount > 0
        financial_data = FinancialRecordCreate(
            date=updated_customer.purchase_date or date.today(),
            transaction_type="Income",
            description=f"Sale to {updated_customer.customer_name} - {updated_customer.product_purchased or 'Product'}",
            category="Sales",
            amount=updated_customer.total_amount,
            payment_method=updated_customer.payment_method,
            status=updated_customer.payment_status or "Pending",
            notes=updated_customer.notes,
            customer_id=updated_customer.id
        )
        crud_financial.create_record(db, financial_data)

    return updated_customer

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    # Optional: Delete associated financial records?
    # For now, let's keep them but maybe unlink them? Or cascade delete?
    # Let's leave them for financial history but unlink
    
    # Unlink financial records
    existing_records = db.query(crud_financial.FinancialRecord).filter(
        crud_financial.FinancialRecord.customer_id == customer_id
    ).all()
    for record in existing_records:
        record.customer_id = None
        db.add(record)
    db.commit()

    ok = crud_customer.delete_customer(db, customer_id)
    if not ok:
        raise HTTPException(404, "Customer not found")
    return {"message": "Deleted"}
