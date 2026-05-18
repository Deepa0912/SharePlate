from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class FoodCategory(str, Enum):
    vegetarian = "vegetarian"
    non_vegetarian = "non_vegetarian"
    vegan = "vegan"
    dessert = "dessert"
    snack = "snack"
    beverage = "beverage"
    other = "other"


class PlateStatus(str, Enum):
    available = "available"
    reserved = "reserved"
    claimed = "claimed"
    expired = "expired"


# ---------------------------------------------------------------------------
# Plate DB Schema
# ---------------------------------------------------------------------------
class PlateInDB(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    title: str
    description: str
    category: FoodCategory
    quantity: int
    location: str
    image_url: Optional[str] = None
    status: PlateStatus = PlateStatus.available
    donor_id: str                           # references users._id
    tags: List[str] = []
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


# ---------------------------------------------------------------------------
# Plate Request / Response Schemas
# ---------------------------------------------------------------------------
class PlateCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    category: FoodCategory
    quantity: int = Field(..., gt=0)
    location: str = Field(..., min_length=3)
    image_url: Optional[str] = None
    tags: Optional[List[str]] = []
    expires_at: Optional[datetime] = None


class PlateResponse(BaseModel):
    id: str
    title: str
    description: str
    category: FoodCategory
    quantity: int
    location: str
    image_url: Optional[str] = None
    status: PlateStatus
    donor_id: str
    tags: List[str]
    expires_at: Optional[datetime]
    created_at: datetime


class PlateUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = None
    quantity: Optional[int] = Field(None, gt=0)
    location: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[PlateStatus] = None
    tags: Optional[List[str]] = None
    expires_at: Optional[datetime] = None
