from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.financial import FinancialRecord
from app.models.customer import Customer
from datetime import datetime, timedelta

def get_financial_summary(db: Session):
    """Calculate total sales, expenses, and net profit from financial records"""
    
    # Total Sales (Income transactions)
    total_sales = db.query(func.sum(FinancialRecord.amount))\
        .filter(FinancialRecord.transaction_type == "Income")\
        .scalar() or 0.0
    
    # Total Expenses (Expense transactions)
    total_expenses = db.query(func.sum(FinancialRecord.amount))\
        .filter(FinancialRecord.transaction_type == "Expense")\
        .scalar() or 0.0
    
    # Net Profit
    net_profit = total_sales - total_expenses
    
    return {
        "total_sales": total_sales,
        "total_expenses": total_expenses,
        "net_profit": net_profit
    }

def get_customer_stats(db: Session):
    """Get total customers and repeat customers count"""
    
    # Total customers
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    
    # Repeat customers - customers with customer_type = "Repeat" or "Returning"
    # or customers who appear multiple times in financial records
    repeat_customers = db.query(func.count(Customer.id))\
        .filter(Customer.customer_type.in_(["Repeat", "Returning"]))\
        .scalar() or 0
    
    return {
        "total_customers": total_customers,
        "repeat_customers": repeat_customers
    }

def get_sales_trend(db: Session, days: int = 30):
    """Get sales data for the last N days for charts"""
    
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    # Query sales grouped by date
    sales_by_date = db.query(
        FinancialRecord.date,
        func.sum(FinancialRecord.amount).label('total')
    ).filter(
        FinancialRecord.transaction_type == "Income",
        FinancialRecord.date >= start_date,
        FinancialRecord.date <= end_date
    ).group_by(FinancialRecord.date)\
     .order_by(FinancialRecord.date)\
     .all()
    
    return [
        {
            "date": str(record.date),
            "amount": record.total
        }
        for record in sales_by_date
    ]

def get_expense_breakdown(db: Session):
    """Get expenses grouped by category for pie chart"""
    
    expenses_by_category = db.query(
        FinancialRecord.category,
        func.sum(FinancialRecord.amount).label('total')
    ).filter(
        FinancialRecord.transaction_type == "Expense",
        FinancialRecord.category.isnot(None)
    ).group_by(FinancialRecord.category)\
     .all()
    
    return [
        {
            "category": record.category or "Other",
            "amount": record.total
        }
        for record in expenses_by_category
    ]

def get_monthly_comparison(db: Session):
    """Get income vs expenses for the current month"""
    
    # Get current month start and end dates
    now = datetime.now()
    start_of_month = datetime(now.year, now.month, 1).date()
    
    # Income for current month
    monthly_income = db.query(func.sum(FinancialRecord.amount))\
        .filter(
            FinancialRecord.transaction_type == "Income",
            FinancialRecord.date >= start_of_month
        ).scalar() or 0.0
    
    # Expenses for current month
    monthly_expenses = db.query(func.sum(FinancialRecord.amount))\
        .filter(
            FinancialRecord.transaction_type == "Expense",
            FinancialRecord.date >= start_of_month
        ).scalar() or 0.0
    
    return {
        "income": monthly_income,
        "expenses": monthly_expenses
    }
