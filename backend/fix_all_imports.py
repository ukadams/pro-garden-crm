import os
import fileinput

# Directory containing the router files
routers_dir = os.path.join('app', 'routers')

# List of router files to update
router_files = [
    'inventory.py',
    'customer.py',
    'financial.py',
    'supplier.py',
    'delivery.py',
    'marketing.py',
    'auth.py'
]

# Fix imports in each router file
for filename in router_files:
    filepath = os.path.join(routers_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (not found)")
        continue
        
    print(f"Fixing imports in {filename}...")
    with fileinput.FileInput(filepath, inplace=True) as file:
        for line in file:
            # Replace 'backend.app.' with 'app.'
            print(line.replace('backend.app.', 'app.'), end='')

print("\n✅ Import fixes completed. Please verify the changes and restart the server.")
