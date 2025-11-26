import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_delivery_create():
    payload = {
        "date": "2025-11-24",
        "customer_name": "Test Customer",
        "location": "Test Location",
        "item_delivered": "Test Item",
        "quantity": 5,
        "delivery_person": "John Doe",
        "delivery_cost": 1500.00,
        "notes": "Test delivery note"
    }

    print(f"Testing POST to {BASE_URL}/deliveries/")
    print(f"Payload: {json.dumps(payload, indent=2)}\n")
    
    try:
        response = requests.post(f"{BASE_URL}/deliveries/", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"\nResponse Body:")
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_delivery_create()
