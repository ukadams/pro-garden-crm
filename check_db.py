import sqlite3
import os

db_path = "backend/pro_garden_crm.db"

if not os.path.exists(db_path):
    print(f"Database file not found at: {db_path}")
    print("Looking for database files...")
    for root, dirs, files in os.walk("backend"):
        for file in files:
            if file.endswith(".db"):
                print(f"Found: {os.path.join(root, file)}")
else:
    print(f"Database found at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if delivery_logs table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='delivery_logs';")
    result = cursor.fetchone()
    
    if result:
        print("\n[OK] delivery_logs table EXISTS")
        
        # Get table schema
        cursor.execute("PRAGMA table_info(delivery_logs);")
        columns = cursor.fetchall()
        print("\nTable schema:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
    else:
        print("\n[ERROR] delivery_logs table DOES NOT EXIST")
        print("\nAvailable tables:")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        for table in tables:
            print(f"  - {table[0]}")
    
    conn.close()
