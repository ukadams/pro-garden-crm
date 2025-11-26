import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_delivery_api():
    print("Testing Delivery API...")

    # 1. Create a delivery log
    payload = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "customer_name": "Test Customer",
        "location": "Test Location",
        "item_delivered": "Test Item",
        "quantity": 5,
        "delivery_person": "John Doe",
        "delivery_cost": 1500.00,
        "notes": "Test delivery note"
    }

    print(f"\nCreating delivery log with payload: {json.dumps(payload, indent=2)}")
    try:
        response = requests.post(f"{BASE_URL}/deliveries/", json=payload)
        if response.status_code == 200:
            print("SUCCESS: Delivery log created.")
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            delivery_id = data['id']
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"ERROR: {e}")
        return

    # 2. List delivery logs
    print("\nListing delivery logs...")
    try:
        response = requests.get(f"{BASE_URL}/deliveries/")
        if response.status_code == 200:
            print("SUCCESS: Retrieved delivery logs.")
            logs = response.json()
            print(f"Found {len(logs)} logs.")
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"ERROR: {e}")

    # 3. Update delivery log
    update_payload = {
        "notes": "Updated test note"
    }
    print(f"\nUpdating delivery log {delivery_id}...")
    try:
        response = requests.put(f"{BASE_URL}/deliveries/{delivery_id}", json=update_payload)
        if response.status_code == 200:
            print("SUCCESS: Delivery log updated.")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"ERROR: {e}")

    # 4. Delete delivery log
    print(f"\nDeleting delivery log {delivery_id}...")
    try:
        response = requests.delete(f"{BASE_URL}/deliveries/{delivery_id}")
        if response.status_code == 200:
            print("SUCCESS: Delivery log deleted.")
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_delivery_api()
