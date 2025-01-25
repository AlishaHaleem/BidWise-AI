from pydantic import BaseModel, Field
from typing import Optional

class Bid(BaseModel):
    provider: str = Field(..., example="TechNet Solutions")
    cost: str = Field(..., example="$125,000")
    coverage: str = Field(..., example="98%")
    aiScore: int = Field(..., example=85)
    project_id: str = Field(..., example="PROJECT_ID_1")
    bidder_id: str = Field(..., example="BIDDER_1")
    bid_id: str = Field(..., example="BID_1")