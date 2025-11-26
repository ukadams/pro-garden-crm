from sqlalchemy.orm import Session
from app.models.marketing import MarketingTracker
from app.schemas.marketing import MarketingTrackerCreate, MarketingTrackerUpdate

def list_campaigns(db: Session):
    return db.query(MarketingTracker).order_by(MarketingTracker.post_date.desc()).all()

def get_campaign(db: Session, campaign_id: int):
    return db.query(MarketingTracker).filter(MarketingTracker.id == campaign_id).first()

def create_campaign(db: Session, data: MarketingTrackerCreate):
    data_dict = data.model_dump()
    # Convert date string to date object if needed
    if isinstance(data_dict.get('post_date'), str):
        from datetime import datetime
        data_dict['post_date'] = datetime.strptime(data_dict['post_date'], '%Y-%m-%d').date()
    obj = MarketingTracker(**data_dict)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_campaign(db: Session, campaign_id: int, data: MarketingTrackerUpdate):
    c = get_campaign(db, campaign_id)
    if not c:
        return None
    data_dict = data.model_dump(exclude_unset=True)
    # Convert date string to date object if needed
    if 'post_date' in data_dict and isinstance(data_dict['post_date'], str):
        from datetime import datetime
        data_dict['post_date'] = datetime.strptime(data_dict['post_date'], '%Y-%m-%d').date()
    for k, v in data_dict.items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c

def delete_campaign(db: Session, campaign_id: int):
    c = get_campaign(db, campaign_id)
    if not c:
        return False
    db.delete(c)
    db.commit()
    return True
