import requests

url = "http://localhost:8000/dashboard/stats"
response = requests.get(url)
data = response.json()

print("=" * 60)
print("ProGarden CRM - Dashboard Summary")
print("=" * 60)
print(f"\nTotal Sales: N{data['total_sales']:,.0f}")
print(f"Total Expenses: N{data['total_expenses']:,.0f}")
print(f"Net Profit: N{data['net_profit']:,.0f}")
print(f"\nTotal Customers: {data['total_customers']}")
print(f"Repeat Customers: {data['repeat_customers']}")
print("\n" + "=" * 60)
print("Test data successfully loaded!")
print("=" * 60)
