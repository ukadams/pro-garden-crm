from sqlalchemy import Column, Integer, String, Float, Date
from app.core.database import Base

class MarketingTracker(Base):
    __tablename__ = "marketing_tracker"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)
    post_date = Column(Date, nullable=True)
    content_type = Column(String, nullable=True)
    description = Column(String, nullable=True)
    engagement = Column(Integer, nullable=True)
    sales_from_post = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
