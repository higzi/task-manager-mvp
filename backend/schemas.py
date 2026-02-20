from pydantic import BaseModel, Field
from datetime import date
from uuid import UUID

class UserAuth(BaseModel):
    username: str 
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskCreate(BaseModel):
    title: str
    deadline: date
    importance: int = Field(ge=1, le=10)
    complexity: int = Field(gt=0)

class TaskResponse(TaskCreate):
    id: UUID
    score: float
    status_id: int

    class Config:
        from_attributes = True