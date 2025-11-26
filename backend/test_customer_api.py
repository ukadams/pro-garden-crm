"""
Test script to check what data the frontend is sending
"""
import requests
import json

# Test data matching what the frontend sends
test_customer = {
    "customer_name": "Test Customer",
    "phone_number": "1234567890",
    "address": None,
    "product_purchased": None,
    "quantity": 0,
    "total_amount": 0,
    "payment_status": "Pending",
    "delivery_status": "Pending",
    "notes": None,
    "customer_type": "New",
    "channel": None,
    "preferred_product": None,
    "follow_up_date": None
}

print("Sending data:")
print(json.dumps(test_customer, indent=2))

try:
    response = requests.post(
        "http://localhost:8000/customers/",
        json=test_customer
    )
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
