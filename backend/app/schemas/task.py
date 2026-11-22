
from datetime import date, datetime
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict


# Data required when creating a task
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Literal["low", "medium", "high"] = "medium"
    due_date: Optional[date] = None


# Data allowed when updating a task
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["pending", "completed"]] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    due_date: Optional[date] = None


# Data returned when viewing a task
class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
