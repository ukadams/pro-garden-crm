import requests
import json

url = "http://localhost:8000/inventory/"
payload = {
    "item_name": "Test Item",
    "category": "",
    "quantity_in_stock": 0,
    "unit": "",
    "cost_price": 0,
    "selling_price": 0,
    "supplier": "",
    "restock_level": 5,
    "status": "In Stock"
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
