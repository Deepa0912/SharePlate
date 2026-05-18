from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId

from database import get_database
from models.user import UserResponse, UserUpdate
from utils.auth import get_current_user
from utils.helpers import serialize_doc, str_to_objectid

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_me(current_user_id: str = Depends(get_current_user), db=Depends(get_database)):
    user = await db["users"].find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return serialize_doc(user)


@router.patch("/me", response_model=UserResponse)
async def update_me(
    update_data: UserUpdate,
    current_user_id: str = Depends(get_current_user),
    db=Depends(get_database),
):
    updates = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")

    await db["users"].update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": updates},
    )
    updated = await db["users"].find_one({"_id": ObjectId(current_user_id)})
    return serialize_doc(updated)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db=Depends(get_database)):
    try:
        oid = str_to_objectid(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID.")

    user = await db["users"].find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return serialize_doc(user)
