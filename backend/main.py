"""
main.py
=======
SharePlate FastAPI Backend
Includes AI-powered donation priority prediction via priority_engine.py
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import users_collection, donations_collection, ngos_collection
from ngo_engine import recommend_ngo
from priority_engine import predict_priority          # <-- AI priority engine
from food_classifier import classify_food             # <-- AI food classifier
from analytics_engine import compute_analytics         # <-- Analytics engine
import bcrypt
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import cloudinary.uploader
import cloudinary_config
from bson import ObjectId

load_dotenv()

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(title="SharePlate API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # restrict to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET = os.getenv("JWT_SECRET", "mysecretkey")


# ===========================================================================
# USER MODELS
# ===========================================================================

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginData(BaseModel):
    email: str
    password: str


# ===========================================================================
# NGO MODEL
# ===========================================================================

class NGO(BaseModel):
    name: str
    city: str
    lat: float
    lng: float
    capacity: str          # "large" | "medium" | "small"
    speciality: list[str]  # e.g. ["dairy", "perishable"]
    contact: str
    active: bool = True
    description: str = ""


# ===========================================================================
# HOME ROUTE
# ===========================================================================

@app.get("/")
def home():
    return {"message": "SharePlate Backend Running", "version": "2.0.0"}


# ===========================================================================
# SIGNUP API
# ===========================================================================

@app.post("/signup")
def signup(user: User):
    """Register a new user. Returns error if email already exists."""

    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password with bcrypt before storing
    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt(),
    )

    users_collection.insert_one({
        "name":     user.name,
        "email":    user.email,
        "password": hashed_password,
        "role":     user.role,
    })

    return {"message": "User created successfully"}


# ===========================================================================
# LOGIN API
# ===========================================================================

@app.post("/login")
def login(data: LoginData):
    """Authenticate user and return a signed JWT token."""

    user = users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Verify password against bcrypt hash
    password_correct = bcrypt.checkpw(
        data.password.encode("utf-8"),
        user["password"],
    )

    if not password_correct:
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Issue JWT valid for 24 hours
    token = jwt.encode(
        {
            "email": user["email"],
            "role":  user.get("role", "donor"),
            "exp":   datetime.utcnow() + timedelta(days=1),
        },
        JWT_SECRET,
        algorithm="HS256",
    )

    return {
        "message": "Login successful",
        "token":   token,
        "name":    user.get("name", ""),
        "role":    user.get("role", "donor"),
    }


# ===========================================================================
# DONATE FOOD API  (with AI priority prediction)
# ===========================================================================

@app.post("/donate")
async def donate_food(
    food_name:   str        = Form(...),
    quantity:    str        = Form(...),
    expiry_time: str        = Form(...),
    location:    str        = Form(...),
    donor_id:    str        = Form(...),
    image:       UploadFile = File(...),
):
    """
    Accept a food donation, upload image to Cloudinary,
    predict AI priority, and store everything in MongoDB.
    """

    # --- Upload image to Cloudinary ---
    contents    = await image.read()
    uploaded    = cloudinary.uploader.upload(contents)
    image_url   = uploaded["secure_url"]

    # --- AI Priority Prediction ---
    priority = predict_priority(
        food_name=food_name,
        quantity=quantity,
        expiry_time=expiry_time,
    )

    # --- Build donation document ---
    donation = {
        "food_name":   food_name,
        "quantity":    quantity,
        "expiry_time": expiry_time,
        "location":    location,
        "donor_id":    donor_id,
        "image_url":   image_url,
        "status":      "Pending",
        "priority":    priority,           # AI-assigned field
        "created_at":  datetime.utcnow().isoformat(),
    }

    result = donations_collection.insert_one(donation)

    return {
        "message":     "Donation added successfully",
        "donation_id": str(result.inserted_id),
        "image_url":   image_url,
        "priority":    priority,           # return to frontend immediately
    }


# ===========================================================================
# GET ALL DONATIONS API
# ===========================================================================

@app.get("/donations")
def get_donations():
    """
    Fetch all donations from MongoDB.
    Returns priority field and recommended_ngo for each donation.
    Donations are sorted by priority (HIGH first) then by creation time.
    """

    # Priority sort order: HIGH=0, MEDIUM=1, LOW=2
    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}

    # Load all active NGOs once — avoids N+1 queries
    all_ngos = list(ngos_collection.find({"active": True}))

    donations = []

    for donation in donations_collection.find():

        # Back-fill priority for old donations that lack the field
        priority = donation.get("priority") or predict_priority(
            food_name=donation.get("food_name", ""),
            quantity=donation.get("quantity", "0"),
            expiry_time=donation.get("expiry_time", ""),
        )

        # AI NGO recommendation
        recommended = recommend_ngo(
            ngos=all_ngos,
            food_name=donation.get("food_name", ""),
            quantity=donation.get("quantity", "0"),
            priority=priority,
            location=donation.get("location", ""),
        )

        donations.append({
            "id":              str(donation["_id"]),
            "food_name":       donation["food_name"],
            "quantity":        donation["quantity"],
            "expiry_time":     donation["expiry_time"],
            "location":        donation["location"],
            "donor_id":        donation["donor_id"],
            "image_url":       donation["image_url"],
            "status":          donation["status"],
            "priority":        priority,
            "created_at":      donation.get("created_at", ""),
            "recommended_ngo": recommended,
        })

    # Sort: HIGH → MEDIUM → LOW, then by created_at descending
    donations.sort(
        key=lambda d: (
            priority_order.get(d["priority"], 1),
            d["created_at"],
        )
    )

    return donations


# ===========================================================================
# NGO APIs
# ===========================================================================

@app.post("/ngo", status_code=201)
def create_ngo(ngo: NGO):
    """Insert a new NGO into the ngos collection."""
    result = ngos_collection.insert_one(ngo.dict())
    return {
        "message": "NGO created successfully",
        "ngo_id":  str(result.inserted_id),
    }


@app.get("/recommended-ngo/{donation_id}")
def get_recommended_ngo(donation_id: str):
    """
    Run the AI scoring engine against all active NGOs for a specific donation.
    Returns the best-matching NGO with name, distance_km, and match_percentage.
    """
    # Fetch the donation
    donation = donations_collection.find_one({"_id": ObjectId(donation_id)})
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    # Back-fill priority if needed
    priority = donation.get("priority") or predict_priority(
        food_name=donation.get("food_name", ""),
        quantity=donation.get("quantity", "0"),
        expiry_time=donation.get("expiry_time", ""),
    )

    all_ngos = list(ngos_collection.find({"active": True}))

    recommended = recommend_ngo(
        ngos=all_ngos,
        food_name=donation.get("food_name", ""),
        quantity=donation.get("quantity", "0"),
        priority=priority,
        location=donation.get("location", ""),
    )

    if not recommended:
        raise HTTPException(status_code=404, detail="No active NGOs found")

    return recommended


# ===========================================================================
# PREDICT PRIORITY (standalone endpoint — useful for frontend preview)
# ===========================================================================

@app.post("/predict-priority")
def predict_priority_endpoint(
    food_name:   str = Form(...),
    quantity:    str = Form(...),
    expiry_time: str = Form(...),
):
    """
    Preview the AI-predicted priority without creating a donation.
    Useful for showing the badge in the form before submission.
    """
    priority = predict_priority(food_name, quantity, expiry_time)
    return {"priority": priority}


# ===========================================================================
# DELETE DONATION API
# ===========================================================================

@app.delete("/donation/{donation_id}")
def delete_donation(donation_id: str):
    """Delete a donation by its MongoDB ObjectId."""

    result = donations_collection.delete_one({"_id": ObjectId(donation_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Donation not found")

    return {"message": "Donation deleted successfully"}


# ===========================================================================
# AI FOOD IMAGE CLASSIFICATION API
# ===========================================================================

@app.post("/classify-food")
async def classify_food_endpoint(image: UploadFile = File(...)):
    """
    Accept an uploaded food image and return:
      - food_name        : predicted food type (human-readable)
      - confidence       : confidence score 0-100
      - label_raw        : raw ImageNet class name
      - top_predictions  : list of food matches found in top-5
      - is_food          : True if a food label was matched

    Uses MobileNetV2 pretrained on ImageNet (loaded at startup).
    Auto-fill threshold is handled on the frontend (>= 80% confidence).
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"Expected an image file, got: {image.content_type}"
        )

    try:
        image_bytes = await image.read()
        result = classify_food(image_bytes)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Classification error: {exc}")


# ===========================================================================
# GET ANALYTICS API
# ===========================================================================

@app.get("/analytics")
def get_analytics():
    """
    Fetch all donations from MongoDB and compute statistics.
    Returns:
      - summary (total donations, meals saved, active locations)
      - monthly_trends (last 6 months chronological donations counts)
      - top_foods (top 5 most common foods)
      - top_locations (top 5 busiest locations)
    """
    try:
        # Load all donations from the database
        donations = list(donations_collection.find())
        # Compute and return analytics data
        return compute_analytics(donations)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load analytics: {exc}")