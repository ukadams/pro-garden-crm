from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.schemas.financial import FinancialRecordCreate, FinancialRecordResponse, FinancialRecordUpdate
from app.crud import financial as crud_financial
from app.crud import customer as crud_customer
from datetime import date

router = APIRouter(prefix="/financial", tags=["Financial"])

@router.get("/", response_model=list[FinancialRecordResponse])
def list_records(db: Session = Depends(get_db)):
    records = crud_financial.list_records(db)
    # Add customer names to response
    for record in records:
        if record.customer_id:
            customer = crud_customer.get_customer(db, record.customer_id)
            if customer:
                record.customer_name = customer.customer_name
    return records

@router.post("/", response_model=FinancialRecordResponse)
def create_record(payload: FinancialRecordCreate, db: Session = Depends(get_db)):
    return crud_financial.create_record(db, payload)

@router.post("/from-customer/{customer_id}", response_model=FinancialRecordResponse)
def create_from_customer(customer_id: int, db: Session = Depends(get_db)):
    """Create a financial record from a customer's purchase data"""
    customer = crud_customer.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(404, "Customer not found")
    
    # Create financial record from customer data
    financial_data = FinancialRecordCreate(
        date=customer.purchase_date or date.today(),
        transaction_type="Income",
        description=f"Sale to {customer.customer_name} - {customer.product_purchased or 'Product'}",
        category="Sales",
        amount=customer.total_amount or 0.0,
        payment_method=customer.payment_status,  # Can be improved
        status=customer.payment_status or "Pending",
        notes=customer.notes,
        customer_id=customer.id
    )
    
    return crud_financial.create_record(db, financial_data)

@router.get("/{record_id}", response_model=FinancialRecordResponse)
def get_record(record_id: int, db: Session = Depends(get_db)):
    r = crud_financial.get_record(db, record_id)
    if not r:
        raise HTTPException(404, "Record not found")
    # Add customer name
    if r.customer_id:
        customer = crud_customer.get_customer(db, r.customer_id)
        if customer:
            r.customer_name = customer.customer_name
    return r

@router.put("/{record_id}", response_model=FinancialRecordResponse)
def update_record(record_id: int, payload: FinancialRecordUpdate, db: Session = Depends(get_db)):
    updated = crud_financial.update_record(db, record_id, payload)
    if not updated:
        raise HTTPException(404, "Record not found")
    return updated

@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    ok = crud_financial.delete_record(db, record_id)
    if not ok:
        raise HTTPException(404, "Record not found")
    return {"message": "Deleted"}

@router.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    # totals
    total_income = db.query(func.coalesce(func.sum(crud_financial.FinancialRecord.amount), 0)).filter(
        crud_financial.FinancialRecord.transaction_type.ilike("income")).scalar()
    total_expense = db.query(func.coalesce(func.sum(crud_financial.FinancialRecord.amount), 0)).filter(
        crud_financial.FinancialRecord.transaction_type.ilike("expense")).scalar()
    return {"total_income": total_income or 0, "total_expense": total_expense or 0, "net_profit": (total_income or 0) - (total_expense or 0)}
