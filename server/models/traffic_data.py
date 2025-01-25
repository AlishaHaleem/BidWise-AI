from pydantic import BaseModel, Field

class TrafficData(BaseModel):
    time: str = Field(..., example="00:00")
    bandwidth: int = Field(..., example=20)