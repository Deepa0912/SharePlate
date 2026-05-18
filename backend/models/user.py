from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId


# Helper to handle MongoDB ObjectId serialization
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string")
        return schema


# ---------------------------------------------------------------------------
# User DB Schema
# ---------------------------------------------------------------------------
class UserInDB(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    hashed_password: str
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


# ---------------------------------------------------------------------------
# User Request / Response Schemas
# ---------------------------------------------------------------------------
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    address: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: bool
    created_at: datetime


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    address: Optional[str] = None
