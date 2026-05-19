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
from recipe_engine import suggest_recipes              # <-- AI Recipe engine
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
            "status":          donation.get("status", "Pending"),
            "booked_by":       donation.get("booked_by", None),
            "booked_at":       donation.get("booked_at", None),
            "collected_at":    donation.get("collected_at", None),
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