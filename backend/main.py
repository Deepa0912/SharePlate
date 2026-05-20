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
from chatbot_engine import generate_chat_response      # <-- AI Chatbot engine
from deep_translator import GoogleTranslator          # <-- Deep Translator
from karma_engine import compute_user_karma, build_leaderboard  # <-- Karma engine
from recipe_engine import suggest_recipes, find_meal_kit_match  # <-- AI Recipe engine
from eco_engine import calculate_eco_impact            # <-- Eco engine
from postcard_engine import generate_impact_postcard   # <-- Postcard engine
import bcrypt
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import re
import cloudinary.uploader
import cloudinary_config
from bson import ObjectId

load_dotenv()

# ---------------------------------------------------------------------------
# Donation forecasting utilities
# ---------------------------------------------------------------------------
PERISHABLE_KEYWORDS = [
    "salad", "fruit", "milk", "paneer", "yogurt", "curd", "dairy",
    "fish", "meat", "chicken", "egg", "cooked", "perishable",
    "vegetable", "vegetables", "juice", "sandwich",
]

def _parse_expiry_minutes(expiry_time: str) -> int:
    content = str(expiry_time or "").strip().lower()
    if not content:
        return 180

    match = re.search(r"(\d+(?:\.\d+)?)", content)
    if not match:
        return 180

    value = float(match.group(1))
    if "day" in content or re.search(r"\bd\b", content):
        return int(value * 24 * 60)
    if "hour" in content or "hr" in content or re.search(r"\bh\b", content):
        return int(value * 60)
    if "min" in content or "minute" in content:
        return int(value)
    if "plate" in content or "serving" in content or "kg" in content or "litre" in content:
        return int(value * 60 if value <= 24 else 1440)
    return int(value)


def _parse_datetime(value: str) -> datetime:
    try:
        return datetime.fromisoformat(value)
    except Exception:
        try:
            return datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%f")
        except Exception:
            return datetime.utcnow()


def _build_spoilage_info(food_name: str, expiry_time: str, created_at: str) -> dict:
    total_minutes = _parse_expiry_minutes(expiry_time)
    created_dt = _parse_datetime(created_at)
    age_minutes = max(0, int((datetime.utcnow() - created_dt).total_seconds() / 60))
    remaining_minutes = max(0, total_minutes - age_minutes)

    if remaining_minutes <= 0:
        label = "Expired"
        urgency = "HIGH"
        score = 100
        note = "Expired — cannot be used safely"
    elif remaining_minutes <= 120:
        label = "Critical pickup in next 2h"
        urgency = "HIGH"
        score = 95
        note = "Immediate pickup needed"
    elif remaining_minutes <= 360:
        label = "Use within 6h"
        urgency = "MEDIUM"
        score = 75
        note = "Moderate spoilage risk"
    elif remaining_minutes <= 24 * 60:
        label = "Good for today"
        urgency = "LOW"
        score = 45
        note = "Safe for same-day redistribution"
    else:
        label = "Fresh — good for later"
        urgency = "LOW"
        score = 20
        note = "Low spoilage risk"

    if any(keyword in (food_name or "").lower() for keyword in PERISHABLE_KEYWORDS) and urgency == "LOW":
        label = "Perishable item — use within 12h"
        score = max(score, 55)
        note = "Perishable food — prioritize sooner"

    return {
        "remaining_minutes": remaining_minutes,
        "spoilage_label": label,
        "urgency_level": urgency,
        "spoilage_score": score,
        "spoilage_note": note,
    }


def _build_donation_payload(donation: dict, all_ngos: list[dict], all_donations: list[dict] = []) -> dict:
    priority = donation.get("priority") or predict_priority(
        food_name=donation.get("food_name", ""),
        quantity=donation.get("quantity", "0"),
        expiry_time=donation.get("expiry_time", ""),
    )

    recommended = recommend_ngo(
        ngos=all_ngos,
        food_name=donation.get("food_name", ""),
        quantity=donation.get("quantity", "0"),
        priority=priority,
        location=donation.get("location", ""),
    )

    spoilage = _build_spoilage_info(
        food_name=donation.get("food_name", ""),
        expiry_time=donation.get("expiry_time", ""),
        created_at=donation.get("created_at", datetime.utcnow().isoformat()),
    )

    meal_suggestions = donation.get("meal_suggestions") or suggest_recipes(
        donation.get("food_name", ""),
        donation.get("quantity", "0"),
    )

    eco_impact = donation.get("eco_impact") or calculate_eco_impact(
        donation.get("food_name", ""),
        donation.get("quantity", "0"),
    )

    meal_kits = find_meal_kit_match(
        donation.get("food_name", ""),
        [d for d in all_donations if str(d.get("_id")) != str(donation.get("_id"))]
    )

    route_text = None
    if recommended and recommended.get("name"):
        route_text = (
            f"Pickup from {donation.get('location', 'donor location')} "
            f"and deliver to {recommended['name']} ({recommended.get('distance_km', 'N/A')} km)"
        )

    return {
        "id": str(donation.get("_id", "")),
        "food_name": donation.get("food_name", ""),
        "quantity": donation.get("quantity", ""),
        "expiry_time": donation.get("expiry_time", ""),
        "location": donation.get("location", ""),
        "donor_id": donation.get("donor_id", ""),
        "image_url": donation.get("image_url", ""),
        "status": donation.get("status", "Pending"),
        "booked_by": donation.get("booked_by", None),
        "booked_at": donation.get("booked_at", None),
        "collected_at": donation.get("collected_at", None),
        "priority": priority,
        "created_at": donation.get("created_at", ""),
        "recommended_ngo": recommended,
        "meal_suggestions": meal_suggestions,
        "meal_kits": meal_kits,
        "spoilage": spoilage,
        "eco_impact": eco_impact,
        "pickup_route": route_text,
    }

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(title="SharePlate API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://share-plate-ws37.vercel.app",
    ],
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


class ForgotPasswordData(BaseModel):
    email: str
    smtp_user: str = None
    smtp_password: str = None


class ResetPasswordData(BaseModel):
    email: str
    reset_code: str
    new_password: str


class ChatRequest(BaseModel):
    message: str
    history: list = []
    lang: str = "en"


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
# PASSWORD RESET APIs
# ===========================================================================

import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_reset_email(to_email: str, code: str, dynamic_user: str = None, dynamic_password: str = None):
    """
    Attempts to send a password reset code to the user's email address via SMTP.
    Supports dynamic email credentials passed from the frontend configuration panel.
    """
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = dynamic_user or os.getenv("SMTP_USER", "")
    smtp_password = dynamic_password or os.getenv("SMTP_PASSWORD", "")
    smtp_from = os.getenv("SMTP_FROM", "SharePlate <no-reply@shareplate.org>")

    if not smtp_user or not smtp_password:
        print(f"\n[SANDBOX EMAIL] To: {to_email} | Reset Code: {code}\n")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "SharePlate Password Reset Verification"
        msg["From"] = smtp_from
        msg["To"] = to_email

        html_content = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; color: #334155; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
            <span style="font-size: 40px;">🍽️</span>
            <h2 style="color: #059669; margin: 8px 0 0; font-weight: 800; font-family: inherit;">SharePlate Recovery</h2>
          </div>
          <p style="font-size: 15px; line-height: 1.5; color: #334155;">Hello,</p>
          <p style="font-size: 15px; line-height: 1.5; color: #334155;">We received a request to reset the password for your SharePlate account. Use the 6-digit verification code below to complete the reset process:</p>
          <div style="text-align: center; margin: 28px 0; background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #059669; font-family: monospace;">{code}</span>
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">This verification code is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; text-align: center; color: #94a3b8; margin: 0;">&copy; 2026 SharePlate App. All rights reserved.</p>
        </div>
        """
        msg.attach(MIMEText(html_content, "html"))

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"[SMTP ERROR] Failed to send email to {to_email}: {e}")
        return False


@app.post("/forgot-password")
def forgot_password(data: ForgotPasswordData):
    """
    Generate a password reset code. If SMTP credentials exist in .env,
    sends a premium HTML email containing the reset code.
    """
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User with this email does not exist")

    # Generate 6-digit code
    reset_code = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=15)

    users_collection.update_one(
        {"email": data.email},
        {"$set": {"reset_code": reset_code, "reset_expiry": expiry}}
    )

    # Attempt to send real email using dynamic credentials if passed
    email_sent = send_reset_email(data.email, reset_code, data.smtp_user, data.smtp_password)

    return {
        "message": "Reset code generated successfully" + (" and sent to your email!" if email_sent else ""),
        "reset_code": reset_code,
        "email_sent": email_sent,
    }


@app.post("/reset-password")
def reset_password(data: ResetPasswordData):
    """
    Verify reset code and update user's password.
    """
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    saved_code = user.get("reset_code")
    expiry = user.get("reset_expiry")

    if not saved_code or not expiry:
        raise HTTPException(status_code=400, detail="No reset request found for this user")

    # Validate expiration
    if datetime.utcnow() > expiry:
        raise HTTPException(status_code=400, detail="Reset code has expired")

    # Validate code match
    if saved_code != data.reset_code:
        raise HTTPException(status_code=400, detail="Invalid reset code")

    # Hash new password
    hashed_password = bcrypt.hashpw(
        data.new_password.encode("utf-8"),
        bcrypt.gensalt(),
    )

    # Update in DB and clear reset codes
    users_collection.update_one(
        {"email": data.email},
        {
            "$set": {"password": hashed_password},
            "$unset": {"reset_code": "", "reset_expiry": ""}
        }
    )

    return {"message": "Password has been successfully reset"}


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
    meal_suggestions = suggest_recipes(food_name, quantity)
    spoilage = _build_spoilage_info(food_name, expiry_time, datetime.utcnow().isoformat())
    eco_impact = calculate_eco_impact(food_name, quantity)

    donation = {
        "food_name":        food_name,
        "quantity":         quantity,
        "expiry_time":      expiry_time,
        "location":         location,
        "donor_id":         donor_id,
        "image_url":        image_url,
        "status":           "Pending",
        "priority":         priority,
        "created_at":       datetime.utcnow().isoformat(),
        "meal_suggestions": meal_suggestions,
        "spoilage":         spoilage,
        "eco_impact":       eco_impact,
        "urgency_level":    spoilage["urgency_level"],
    }

    result = donations_collection.insert_one(donation)

    return {
        "message":           "Donation added successfully",
        "donation_id":       str(result.inserted_id),
        "image_url":         image_url,
        "priority":          priority,
        "urgency_level":     spoilage["urgency_level"],
        "spoilage_label":    spoilage["spoilage_label"],
        "meal_suggestions":  meal_suggestions,
        "eco_impact":        eco_impact,
    }


# ===========================================================================
# GET ALL DONATIONS API
# ===========================================================================

@app.get("/donations")
def get_donations():
    """
    Fetch all donations from MongoDB.
    Returns enriched donation objects with AI recommendations, spoilage forecasts, meal suggestions, and pickup routing.
    Congratulations: this endpoint now powers unique SharePlate features.
    """

    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    all_ngos = list(ngos_collection.find({"active": True}))
    raw_donations = list(donations_collection.find())

    donations = [
        _build_donation_payload(donation, all_ngos, raw_donations)
        for donation in raw_donations
    ]

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


@app.get("/volunteer-shifts")
def get_volunteer_shifts(max_results: int = 3):
    """
    Return micro-shift pickup suggestions for volunteers.
    Uses urgent donations, NGO matches, and available status to highlight top routes.
    """
    all_ngos = list(ngos_collection.find({"active": True}))
    shifts = []

    for donation in donations_collection.find({"status": {"$in": ["Pending", "Available", "Approved", None]}}):
        payload = _build_donation_payload(donation, all_ngos)
        if payload["spoilage"]["urgency_level"] in ["HIGH", "MEDIUM"]:
            shifts.append({
                "id": payload["id"],
                "food_name": payload["food_name"],
                "quantity": payload["quantity"],
                "location": payload["location"],
                "urgency_level": payload["spoilage"]["urgency_level"],
                "spoilage_label": payload["spoilage"]["spoilage_label"],
                "recommended_ngo": payload["recommended_ngo"],
                "pickup_route": payload["pickup_route"],
                "created_at": payload["created_at"],
                "spoilage_score": payload["spoilage"]["spoilage_score"],
            })

    shifts.sort(
        key=lambda s: (
            0 if s["urgency_level"] == "HIGH" else 1,
            s["recommended_ngo"]["distance_km"] if s["recommended_ngo"] else 999,
            s["created_at"],
        )
    )

    return {"shifts": shifts[:max_results]}


@app.get("/donation/{donation_id}/postcard")
def get_donation_postcard(donation_id: str):
    """
    Generate an AI impact postcard for a specific donation.
    """
    query = {}
    try:
        query = {"_id": ObjectId(donation_id)}
        donation = donations_collection.find_one(query)
    except Exception:
        donation = None

    if not donation:
        donation = donations_collection.find_one({"_id": donation_id})

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    # Ensure eco_impact exists
    if "eco_impact" not in donation:
        donation["eco_impact"] = calculate_eco_impact(
            donation.get("food_name", ""),
            donation.get("quantity", "0")
        )

    postcard = generate_impact_postcard(donation)
    return postcard


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
    """Delete a donation by its MongoDB ObjectId or raw string ID."""
    try:
        # First, try matching by ObjectId (standard MongoDB format)
        query = {"_id": ObjectId(donation_id)}
        result = donations_collection.delete_one(query)
        if result.deleted_count > 0:
            return {"message": "Donation deleted successfully"}
    except Exception:
        pass

    # Fallback: try matching by raw string ID (useful for seeded/mock items)
    result = donations_collection.delete_one({"_id": donation_id})
    if result.deleted_count > 0:
        return {"message": "Donation deleted successfully"}

    raise HTTPException(status_code=404, detail="Donation not found")


# ===========================================================================
# BOOKING & COLLECTION APIs
# ===========================================================================

class BookRequest(BaseModel):
    email: str

@app.post("/donation/{donation_id}/book")
def book_donation(donation_id: str, payload: BookRequest):
    """Book a donation by setting status to 'Booked' and recording who booked it."""
    query = {}
    try:
        query = {"_id": ObjectId(donation_id)}
        donation = donations_collection.find_one(query)
    except Exception:
        donation = None

    if not donation:
        # Fallback to plain string ID match
        donation = donations_collection.find_one({"_id": donation_id})

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    if donation.get("status") not in ["Pending", "Available", "Approved", None]:
        raise HTTPException(status_code=400, detail="Donation is not available for booking")

    donations_collection.update_one(
        {"_id": donation["_id"]},
        {"$set": {
            "status": "Booked",
            "booked_by": payload.email,
            "booked_at": datetime.utcnow().isoformat()
        }}
    )
    return {"message": "Donation booked successfully"}


@app.post("/donation/{donation_id}/cancel-booking")
def cancel_booking_donation(donation_id: str):
    """Cancel booking, reverting status to 'Pending'."""
    query = {}
    try:
        query = {"_id": ObjectId(donation_id)}
        donation = donations_collection.find_one(query)
    except Exception:
        donation = None

    if not donation:
        # Fallback to plain string ID match
        donation = donations_collection.find_one({"_id": donation_id})

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    donations_collection.update_one(
        {"_id": donation["_id"]},
        {"$set": {
            "status": "Pending",
            "booked_by": None,
            "booked_at": None
        }}
    )
    return {"message": "Booking cancelled successfully"}


@app.post("/donation/{donation_id}/collect")
def collect_donation_endpoint(donation_id: str):
    """Mark a booked donation as Collected (completed)."""
    query = {}
    try:
        query = {"_id": ObjectId(donation_id)}
        donation = donations_collection.find_one(query)
    except Exception:
        donation = None

    if not donation:
        # Fallback to plain string ID match
        donation = donations_collection.find_one({"_id": donation_id})

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    donations_collection.update_one(
        {"_id": donation["_id"]},
        {"$set": {
            "status": "Collected",
            "collected_at": datetime.utcnow().isoformat()
        }}
    )
    return {"message": "Donation marked as collected"}


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


# ===========================================================================
# AI CHATBOT API
# ===========================================================================

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    """
    Handle chat messages from the AI assistant frontend.
    """
    try:
        response_text = generate_chat_response(req.message, req.history, req.lang)
        return {"response": response_text}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)))


class TranslateRequest(BaseModel):
    text: str
    target_lang: str


@app.post("/translate")
def translate_endpoint(req: TranslateRequest):
    """
    Translate any custom dynamic text.
    """
    try:
        # GoogleTranslator auto-detects source language
        translated = GoogleTranslator(source='auto', target=req.target_lang).translate(req.text)
        return {"translated_text": translated}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))