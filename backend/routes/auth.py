from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from database import get_database
from models.user import UserCreate, UserResponse
from utils.auth import hash_password, verify_password, create_access_token, get_settings
from utils.helpers import serialize_doc

router = APIRouter()
settings = get_settings()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db=Depends(get_database)):
    # Check duplicate email
    existing = await db["users"].find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )

    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "hashed_password": hash_password(user_data.password),
        "phone": user_data.phone,
        "address": user_data.address,
        "is_active": True,
    }

    result = await db["users"].insert_one(new_user)
    created = await db["users"].find_one({"_id": result.inserted_id})
    return serialize_doc(created)


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_database),
):
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    return {"access_token": access_token, "token_type": "bearer"}
