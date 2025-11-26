import sys
sys.path.append('backend')

from app.core.database import engine
from app.models.delivery import Base as DeliveryBase

print("Creating delivery_logs table...")

try:
    # Create all tables defined in the delivery model
    DeliveryBase.metadata.create_all(bind=engine)
    print("[OK] delivery_logs table created successfully!")
    
    # Verify table was created
    import sqlite3
    conn = sqlite3.connect('backend/pro_garden_crm.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='delivery_logs';")
    result = cursor.fetchone()
    
    if result:
        print("[OK] Verified: delivery_logs table exists")
        
        # Show schema
        cursor.execute("PRAGMA table_info(delivery_logs);")
        columns = cursor.fetchall()
        print("\nTable schema:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
    else:
        print("[ERROR] Table was not created!")
    
    conn.close()
    
except Exception as e:
    print(f"[ERROR] Failed to create table: {e}")
    import traceback
    traceback.print_exc()
