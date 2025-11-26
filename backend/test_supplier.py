import requests
import json

url = "http://localhost:8000/suppliers/"
payload = {
    "supplier_name": "Test Supplier Empty",
    "product_supplied": "",
    "contact": "",
    "payment_terms": "",
    "last_purchase": None,
    "amount_paid": 0,
    "balance": 0,
    "notes": ""
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
