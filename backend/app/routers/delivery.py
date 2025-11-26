from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.delivery import DeliveryLogCreate, DeliveryLogResponse, DeliveryLogUpdate
from app.crud import delivery as crud_delivery

router = APIRouter(prefix="/deliveries", tags=["Deliveries"])

@router.get("/", response_model=list[DeliveryLogResponse])
def list_deliveries(db: Session = Depends(get_db)):
    return crud_delivery.list_deliveries(db)

@router.post("/", response_model=DeliveryLogResponse)
def create_delivery(payload: DeliveryLogCreate, db: Session = Depends(get_db)):
    try:
        return crud_delivery.create_delivery(db, payload)
    except Exception as e:
        import traceback
        error_detail = f"{str(e)}\n{traceback.format_exc()}"
        print(f"ERROR in create_delivery: {error_detail}")
        raise HTTPException(500, detail=str(e))

@router.get("/{delivery_id}", response_model=DeliveryLogResponse)
def get_delivery(delivery_id: int, db: Session = Depends(get_db)):
    d = crud_delivery.get_delivery(db, delivery_id)
    if not d:
        raise HTTPException(404, "Delivery not found")
    return d

@router.put("/{delivery_id}", response_model=DeliveryLogResponse)
def update_delivery(delivery_id: int, payload: DeliveryLogUpdate, db: Session = Depends(get_db)):
    updated = crud_delivery.update_delivery(db, delivery_id, payload)
    if not updated:
        raise HTTPException(404, "Delivery not found")
    return updated

@router.delete("/{delivery_id}")
def delete_delivery(delivery_id: int, db: Session = Depends(get_db)):
    ok = crud_delivery.delete_delivery(db, delivery_id)
    if not ok:
        raise HTTPException(404, "Delivery not found")
    return {"message": "Deleted"}
