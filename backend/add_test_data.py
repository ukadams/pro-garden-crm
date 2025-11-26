import requests
from datetime import datetime, timedelta
import random

# API base URL
BASE_URL = "http://localhost:8000"

# Test data for financial records
test_financial_records = [
    # Income records (Sales)
    {
        "date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
        "transaction_type": "Income",
        "amount": 45000,
        "category": "Plant Sales",
        "description": "Sale of ornamental plants to Mrs. Johnson"
    },
    {
        "date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
        "transaction_type": "Income",
        "amount": 78000,
        "category": "Plant Sales",
        "description": "Bulk order of vegetables to restaurant"
    },
    {
        "date": (datetime.now() - timedelta(days=8)).strftime("%Y-%m-%d"),
        "transaction_type": "Income",
        "amount": 32000,
        "category": "Plant Sales",
        "description": "Garden setup for residential client"
    },
    {
        "date": (datetime.now() - timedelta(days=12)).strftime("%Y-%m-%d"),
        "transaction_type": "Income",
        "amount": 56000,
        "category": "Plant Sales",
        "description": "Flower arrangements for event"
    },
    {
        "date": (datetime.now() - timedelta(days=15)).strftime("%Y-%m-%d"),
        "transaction_type": "Income",
        "amount": 92000,
        "category": "Plant Sales",
        "description": "Landscaping project payment"
    },
    
    # Expense records
    {
        "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "transaction_type": "Expense",
        "amount": 15000,
        "category": "Fertilizer",
        "description": "NPK fertilizer purchase"
    },
    {
        "date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
        "transaction_type": "Expense",
        "amount": 25000,
        "category": "Labor",
        "description": "Weekly wages for 2 workers"
    },
    {
        "date": (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"),
        "transaction_type": "Expense",
        "amount": 8000,
        "category": "Transport",
        "description": "Delivery costs for customer orders"
    },
    {
        "date": (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d"),
        "transaction_type": "Expense",
        "amount": 12000,
        "category": "Seeds",
        "description": "Vegetable seeds and seedlings"
    },
    {
        "date": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
        "transaction_type": "Expense",
        "amount": 5000,
        "category": "Utilities",
        "description": "Water bill for irrigation"
    },
    {
        "date": (datetime.now() - timedelta(days=9)).strftime("%Y-%m-%d"),
        "transaction_type": "Expense",
        "amount": 18000,
        "category": "Equipment",
        "description": "Garden tools and equipment maintenance"
    },
    {
        "date": (datetime.now() - timedelta(days=11)).strftime("%Y-%m-%d"),
        "transaction_type": "Expense",
        "amount": 7500,
        "category": "Pesticides",
        "description": "Organic pest control products"
    },
    {
        "date": (datetime.now() - timedelta(days=13)).strftime("%Y-%m-%d"),
        "transaction_type": "Expense",
        "amount": 20000,
        "category": "Rent",
        "description": "Monthly greenhouse rent"
    },
]

# Test customers
test_customers = [
    {
        "customer_name": "Mrs. Johnson",
        "phone_number": "08012345678",
        "email": "johnson@email.com",
        "address": "15 Garden Street, Lagos",
        "customer_type": "Repeat",
        "purchase_date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
        "total_amount": 45000
    },
    {
        "customer_name": "Green Valley Restaurant",
        "phone_number": "08098765432",
        "email": "greenvalley@restaurant.com",
        "address": "23 Food Court, Ikeja",
        "customer_type": "Repeat",
        "purchase_date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
        "total_amount": 78000
    },
    {
        "customer_name": "Mr. Adebayo",
        "phone_number": "08055556666",
        "email": "adebayo@email.com",
        "address": "42 Residential Close, VI",
        "customer_type": "New",
        "purchase_date": (datetime.now() - timedelta(days=8)).strftime("%Y-%m-%d"),
        "total_amount": 32000
    },
]

# Test marketing posts
test_marketing_posts = [
    {
        "platform": "Instagram",
        "post_date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
        "content_type": "Image",
        "description": "Beautiful orchid collection showcase",
        "engagement": 245,
        "sales_from_post": 15000,
        "notes": "High engagement, led to 3 direct sales"
    },
    {
        "platform": "Facebook",
        "post_date": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
        "content_type": "Video",
        "description": "Garden maintenance tips tutorial",
        "engagement": 189,
        "sales_from_post": 8000,
        "notes": "Good reach, generated inquiries"
    },
    {
        "platform": "WhatsApp",
        "post_date": (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d"),
        "content_type": "Story",
        "description": "New arrivals - succulent plants",
        "engagement": 67,
        "sales_from_post": 12000,
        "notes": "Direct sales from status viewers"
    },
]

def add_financial_records():
    print("Adding financial records...")
    for record in test_financial_records:
        try:
            response = requests.post(f"{BASE_URL}/financial/", json=record)
            if response.status_code == 200:
                print(f"[OK] Added {record['transaction_type']}: N{record['amount']:,} - {record['description']}")
            else:
                print(f"[FAIL] Failed to add record: {response.text}")
        except Exception as e:
            print(f"[ERROR] Error: {e}")

def add_customers():
    print("\nAdding customers...")
    for customer in test_customers:
        try:
            response = requests.post(f"{BASE_URL}/customers/", json=customer)
            if response.status_code == 200:
                print(f"[OK] Added customer: {customer['customer_name']}")
            else:
                print(f"[FAIL] Failed to add customer: {response.text}")
        except Exception as e:
            print(f"[ERROR] Error: {e}")

def add_marketing_posts():
    print("\nAdding marketing posts...")
    for post in test_marketing_posts:
        try:
            response = requests.post(f"{BASE_URL}/marketing/", json=post)
            if response.status_code == 200:
                print(f"[OK] Added marketing post: {post['platform']} - {post['description']}")
            else:
                print(f"[FAIL] Failed to add post: {response.text}")
        except Exception as e:
            print(f"[ERROR] Error: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("ProGarden CRM - Adding Test Data")
    print("=" * 60)
    
    add_financial_records()
    add_customers()
    add_marketing_posts()
    
    print("\n" + "=" * 60)
    print("Test data added successfully!")
    print("=" * 60)
    print("\nSummary:")
    print(f"- Financial Records: {len(test_financial_records)} records")
    print(f"  • Income: {sum(1 for r in test_financial_records if r['transaction_type'] == 'Income')} records")
    print(f"  • Expenses: {sum(1 for r in test_financial_records if r['transaction_type'] == 'Expense')} records")
    print(f"- Customers: {len(test_customers)} customers")
    print(f"- Marketing Posts: {len(test_marketing_posts)} posts")
    print("\nTotal Income: N{:,}".format(sum(r['amount'] for r in test_financial_records if r['transaction_type'] == 'Income')))
    print("Total Expenses: N{:,}".format(sum(r['amount'] for r in test_financial_records if r['transaction_type'] == 'Expense')))
    print("Net Profit: N{:,}".format(
        sum(r['amount'] for r in test_financial_records if r['transaction_type'] == 'Income') -
        sum(r['amount'] for r in test_financial_records if r['transaction_type'] == 'Expense')
    ))
