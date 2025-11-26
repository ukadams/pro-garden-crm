from pydantic import BaseModel
from typing import Optional
from datetime import date

class MarketingTrackerBase(BaseModel):
    platform: str
    post_date: Optional[date] = None
    content_type: Optional[str] = None
    description: Optional[str] = None
    engagement: Optional[int] = None
    sales_from_post: Optional[float] = None
    notes: Optional[str] = None

class MarketingTrackerCreate(MarketingTrackerBase):
    pass

class MarketingTrackerUpdate(BaseModel):
    platform: Optional[str] = None
    post_date: Optional[date] = None
    content_type: Optional[str] = None
    description: Optional[str] = None
    engagement: Optional[int] = None
    sales_from_post: Optional[float] = None
    notes: Optional[str] = None

class MarketingTrackerResponse(MarketingTrackerBase):
    id: int

    class Config:
        from_attributes = True
