from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from database import users_collection, donations_collection
import bcrypt
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import cloudinary.uploader
import cloudinary_config
from bson import ObjectId

load_dotenv()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET = os.getenv("JWT_SECRET")


# =========================
# USER MODELS
# =========================

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginData(BaseModel):
    email: str
    password: str


# =========================
# HOME ROUTE
# =========================

@app.get("/")
def home():
    return {"message": "SharePlate Backend Running"}


# =========================
# SIGNUP API
# =========================

@app.post("/signup")
def signup(user: User):

    existing_user = users_collection.find_one({
        "email": user.email
    })

    if existing_user:
        return {"message": "User already exists"}

    hashed_password = bcrypt.hashpw(
        user.password.encode('utf-8'),
        bcrypt.gensalt()
    )

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    })

    return {"message": "User created successfully"}


# =========================
# LOGIN API
# =========================

@app.post("/login")
def login(data: LoginData):

    user = users_collection.find_one({
        "email": data.email
    })

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    password_correct = bcrypt.checkpw(
        data.password.encode('utf-8'),
        user["password"]
    )

    if not password_correct:
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = jwt.encode(
        {
            "email": user["email"],
            "exp": datetime.utcnow() + timedelta(days=1)
        },
        JWT_SECRET,
        algorithm="HS256"
    )

    return {
        "message": "Login successful",
        "token": token
    }


# =========================
# DONATE FOOD API
# =========================

@app.post("/donate")
async def donate_food(
    food_name: str = Form(...),
    quantity: str = Form(...),
    expiry_time: str = Form(...),
    location: str = Form(...),
    donor_id: str = Form(...),
    image: UploadFile = File(...)
):

    contents = await image.read()
    uploaded_image = cloudinary.uploader.upload(contents)

    image_url = uploaded_image["secure_url"]

    donation = {
        "food_name": food_name,
        "quantity": quantity,
        "expiry_time": expiry_time,
        "location": location,
        "donor_id": donor_id,
        "image_url": image_url,
        "status": "Pending"
    }

    result = donations_collection.insert_one(donation)

    return {
        "message": "Donation added successfully",
        "donation_id": str(result.inserted_id),
        "image_url": image_url
    }


# =========================
# GET ALL DONATIONS API
# =========================

@app.get("/donations")
def get_donations():

    donations = []

    for donation in donations_collection.find():

        donations.append({
            "id": str(donation["_id"]),
            "food_name": donation["food_name"],
            "quantity": donation["quantity"],
            "expiry_time": donation["expiry_time"],
            "location": donation["location"],
            "donor_id": donation["donor_id"],
            "image_url": donation["image_url"],
            "status": donation["status"]
        })

    return donations


# =========================
# DELETE DONATION API
# =========================

@app.delete("/donation/{donation_id}")
def delete_donation(donation_id: str):

    donations_collection.delete_one({
        "_id": ObjectId(donation_id)
    })

    return {
        "message": "Donation deleted successfully"
    }