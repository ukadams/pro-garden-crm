"""
Simple script to update the customers table with new columns
"""
from sqlalchemy import create_engine, text, inspect
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
inspector = inspect(engine)

# Get existing columns
existing_columns = [col['name'] for col in inspector.get_columns('customers')]
print(f"Existing columns: {existing_columns}")

# Columns to add
new_columns = {
    'quantity': 'INTEGER',
    'total_amount': 'REAL',
    'payment_status': 'TEXT',
    'delivery_status': 'TEXT',
    'notes': 'TEXT',
}

with engine.connect() as conn:
    for col_name, col_type in new_columns.items():
        if col_name not in existing_columns:
            sql = f"ALTER TABLE customers ADD COLUMN {col_name} {col_type}"
            try:
                conn.execute(text(sql))
                conn.commit()
                print(f"Added column: {col_name}")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists, skipping")

print("\nDatabase migration completed!")
