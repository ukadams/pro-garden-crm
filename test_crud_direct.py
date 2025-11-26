import sys
sys.path.append('backend')

try:
    from app.crud import delivery as crud_delivery
    from app.schemas.delivery import DeliveryLogCreate
    from app.core.database import SessionLocal
    from datetime import datetime
    
    print("[OK] Imports successful")
    
    # Test creating a delivery log
    db = SessionLocal()
    
    test_data = DeliveryLogCreate(
        date="2025-11-24",
        customer_name="Test Customer",
        location="Test Location",
        item_delivered="Test Item",
        quantity=5,
        delivery_person="John Doe",
        delivery_cost=1500.0,
        notes="Test note"
    )
    
    print(f"\nTest data: {test_data.model_dump()}")
    
    try:
        result = crud_delivery.create_delivery(db, test_data)
        print(f"\n[OK] SUCCESS! Created delivery log with ID: {result.id}")
        print(f"Date type: {type(result.date)}")
        print(f"Date value: {result.date}")
        
        # Clean up
        crud_delivery.delete_delivery(db, result.id)
        print("\n[OK] Cleanup successful")
    except Exception as e:
        print(f"\n[ERROR] creating delivery: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()
        
except Exception as e:
    print(f"[ERROR] Import or setup error: {e}")
    import traceback
    traceback.print_exc()
