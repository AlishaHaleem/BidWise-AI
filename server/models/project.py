from pydantic import BaseModel, Field
from typing import Optional

class Project(BaseModel):
    name: str = Field(..., example="Rural Schools Network - Region A")
    status: str = Field(..., example="Open for Bids")
    schools: int = Field(..., example=15)