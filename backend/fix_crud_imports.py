import os
import fileinput

# Directory containing the CRUD files
crud_dir = os.path.join('app', 'crud')

# List of CRUD files to update
crud_files = [
    'customer.py',
    'inventory.py',
    'financial.py',
    'supplier.py',
    'delivery.py',
    'marketing.py',
    'user.py'
]

# Fix imports in each CRUD file
for filename in crud_files:
    filepath = os.path.join(crud_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (not found)")
        continue
        
    print(f"Fixing imports in {filename}...")
    with fileinput.FileInput(filepath, inplace=True) as file:
        for line in file:
            # Replace 'backend.app.' with 'app.'
            print(line.replace('backend.app.', 'app.'), end='')

print("\n✅ CRUD import fixes completed.")
