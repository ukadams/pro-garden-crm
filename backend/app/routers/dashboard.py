from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud import dashboard as crud_dashboard

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get all dashboard statistics in one call"""
    
    financial_summary = crud_dashboard.get_financial_summary(db)
    customer_stats = crud_dashboard.get_customer_stats(db)
    monthly_comparison = crud_dashboard.get_monthly_comparison(db)
    
    return {
        **financial_summary,
        **customer_stats,
        **monthly_comparison
    }

@router.get("/sales-trend")
def get_sales_trend(days: int = 30, db: Session = Depends(get_db)):
    """Get sales trend data for charts"""
    return crud_dashboard.get_sales_trend(db, days)

@router.get("/expense-breakdown")
def get_expense_breakdown(db: Session = Depends(get_db)):
    """Get expense breakdown by category"""
    return crud_dashboard.get_expense_breakdown(db)
