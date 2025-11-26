import os
import fileinput

# Directory containing the schema files
schemas_dir = os.path.join('app', 'schemas')

# Get all Python files in the schemas directory
schema_files = [f for f in os.listdir(schemas_dir) if f.endswith('.py')]

# Fix imports in each schema file
for filename in schema_files:
    filepath = os.path.join(schemas_dir, filename)
    print(f"Fixing imports in {filename}...")
    with fileinput.FileInput(filepath, inplace=True) as file:
        for line in file:
            # Replace 'backend.app.' with 'app.'
            print(line.replace('backend.app.', 'app.'), end='')

print("\n✅ Schema import fixes completed.")
