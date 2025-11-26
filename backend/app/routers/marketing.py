from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.marketing import MarketingTrackerCreate, MarketingTrackerResponse, MarketingTrackerUpdate
from app.crud import marketing as crud_marketing

router = APIRouter(prefix="/marketing", tags=["Marketing"])

@router.get("/", response_model=list[MarketingTrackerResponse])
def list_campaigns(db: Session = Depends(get_db)):
    return crud_marketing.list_campaigns(db)

@router.post("/", response_model=MarketingTrackerResponse)
def create_campaign(payload: MarketingTrackerCreate, db: Session = Depends(get_db)):
    return crud_marketing.create_campaign(db, payload)

@router.get("/{campaign_id}", response_model=MarketingTrackerResponse)
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    c = crud_marketing.get_campaign(db, campaign_id)
    if not c:
        raise HTTPException(404, "Campaign not found")
    return c

@router.put("/{campaign_id}", response_model=MarketingTrackerResponse)
def update_campaign(campaign_id: int, payload: MarketingTrackerUpdate, db: Session = Depends(get_db)):
    updated = crud_marketing.update_campaign(db, campaign_id, payload)
    if not updated:
        raise HTTPException(404, "Campaign not found")
    return updated

@router.delete("/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    ok = crud_marketing.delete_campaign(db, campaign_id)
    if not ok:
        raise HTTPException(404, "Campaign not found")
    return {"message": "Deleted"}
