import requests

# Test with the old schema format (name, phone)
data_old = {
    "name": "Test Customer",
    "phone": "1234567890",
    "email": None,
    "address": "Test Address",
    "purchase_history": "Test notes"
}

print("Testing with OLD schema format (name, phone):")
print(f"Data: {data_old}")
try:
    response = requests.post("http://localhost:8000/customers/", json=data_old)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
