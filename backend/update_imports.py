import os
import fileinput

# Directory containing the router files
routers_dir = os.path.join('app', 'routers')

# List of router files to update
router_files = [
    'inventory.py',
    'financial.py',
    'supplier.py',
    'delivery.py',
    'marketing.py',
    'auth.py'
]

# Update imports in each router file
for filename in router_files:
    filepath = os.path.join(routers_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (not found)")
        continue
        
    print(f"Updating imports in {filename}...")
    with fileinput.FileInput(filepath, inplace=True) as file:
        for line in file:
            # Replace 'from app.' with 'from ..' for local imports
            line = line.replace('from app.', 'from ..')
            # Handle app.crud imports
            line = line.replace('import app.crud', 'from .. import crud')
            print(line, end='')

print("\n✅ Import updates completed.")
