import requests

# Test with the NEW schema format (customer_name, phone_number)
data_new = {
    "customer_name": "Test Customer",
    "phone_number": "1234567890",
    "address": "Test Address",
    "product_purchased": "Fertilizer",
    "quantity": 10,
    "total_amount": 5000.0,
    "payment_status": "Paid",
    "delivery_status": "Pending",
    "notes": "Test notes",
    "customer_type": "New",
    "channel": "Walk-in",
}

print("Testing with NEW schema format (customer_name, phone_number):")
print(f"Data: {data_new}")
try:
    response = requests.post("http://localhost:8000/customers/", json=data_new)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
