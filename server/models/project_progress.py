from pydantic import BaseModel, Field
from typing import List

class Milestone(BaseModel):
    title: str = Field(..., example="Initial Assessment")
    status: str = Field(..., example="Completed")
    verificationMethod: str = Field(..., example="Site Survey Documentation")
    date: str = Field(..., example="2025-01-15")
    verifier: str = Field(..., example="GIGA Technical Team")

class ProjectProgress(BaseModel):
    project: str = Field(..., example="Remote Learning Initiative C")
    startDate: str = Field(..., example="2025-01-01")
    expectedCompletion: str = Field(..., example="2025-06-30")
    progress: int = Field(..., example=65)
    milestones: List[Milestone]