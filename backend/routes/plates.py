from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

from database import get_database
from models.plate import PlateCreate, PlateResponse, PlateUpdate, PlateStatus, FoodCategory
from utils.auth import get_current_user
from utils.helpers import serialize_doc, str_to_objectid

router = APIRouter()


@router.post("/", response_model=PlateResponse, status_code=status.HTTP_201_CREATED)
async def create_plate(
    plate_data: PlateCreate,
    current_user_id: str = Depends(get_current_user),
    db=Depends(get_database),
):
    new_plate = {
        **plate_data.model_dump(),
        "donor_id": current_user_id,
        "status": PlateStatus.available,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db["plates"].insert_one(new_plate)
    created = await db["plates"].find_one({"_id": result.inserted_id})
    return serialize_doc(created)


@router.get("/", response_model=List[PlateResponse])
async def list_plates(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[FoodCategory] = None,
    status: Optional[PlateStatus] = None,
    location: Optional[str] = None,
    db=Depends(get_database),
):
    query = {}
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    if location:
        query["location"] = {"$regex": location, "$options": "i"}

    cursor = db["plates"].find(query).skip(skip).limit(limit).sort("created_at", -1)
    plates = await cursor.to_list(length=limit)
    return [serialize_doc(p) for p in plates]


@router.get("/{plate_id}", response_model=PlateResponse)
async def get_plate(plate_id: str, db=Depends(get_database)):
    try:
        oid = str_to_objectid(plate_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid plate ID.")

    plate = await db["plates"].find_one({"_id": oid})
    if not plate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plate not found.")
    return serialize_doc(plate)


@router.patch("/{plate_id}", response_model=PlateResponse)
async def update_plate(
    plate_id: str,
    update_data: PlateUpdate,
    current_user_id: str = Depends(get_current_user),
    db=Depends(get_database),
):
    try:
        oid = str_to_objectid(plate_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid plate ID.")

    plate = await db["plates"].find_one({"_id": oid})
    if not plate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plate not found.")
    if plate["donor_id"] != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")

    updates = {k: v for k, v in update_data.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.utcnow()

    await db["plates"].update_one({"_id": oid}, {"$set": updates})
    updated = await db["plates"].find_one({"_id": oid})
    return serialize_doc(updated)


@router.delete("/{plate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plate(
    plate_id: str,
    current_user_id: str = Depends(get_current_user),
    db=Depends(get_database),
):
    try:
        oid = str_to_objectid(plate_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid plate ID.")

    plate = await db["plates"].find_one({"_id": oid})
    if not plate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plate not found.")
    if plate["donor_id"] != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")

    await db["plates"].delete_one({"_id": oid})
