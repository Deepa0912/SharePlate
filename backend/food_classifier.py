"""
food_classifier.py
==================
AI-powered food image classification for SharePlate.

OPTIMIZED VERSION: Swapped MobileNetV2 for Gemini 1.5 Flash.
- Bundle size reduction: ~1.2GB -> <1MB
- Improved accuracy and context awareness
- Fully compatible with Vercel / Render free tiers
"""

import os
import json
import logging
import google.generativeai as genai
from typing import Optional

logger = logging.getLogger(__name__)

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def classify_food(image_bytes: bytes, top_k: int = 5) -> dict:
    """
    Run food classification using Gemini 1.5 Flash (Vision).
    """
    if not GEMINI_API_KEY:
        logger.warning("[food_classifier] No Gemini API Key. Returning fallback.")
        return {
            "food_name": "Unknown dish",
            "confidence": 0,
            "label_raw": "none",
            "top_predictions": [],
            "is_food": False,
        }

    try:
        # Try different model identifiers to fix the 404 "not found" error
        model_names = ["gemini-flash-latest", "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro-vision"]
        response = None
        last_error = None

        prompt = """
        You are an expert food nutritionist and chef. 
        Analyze the provided image and return a JSON object with:
        1. 'food_name': A clear, specific name for the dish (e.g., 'Fresh Pepperoni Pizza', 'Vegetable Biryani').
        2. 'confidence': A number (0-100) reflecting your certainty.
        3. 'is_food': true if the image contains food, false otherwise.
        4. 'category': One of ['Grain', 'Protein', 'Vegetable', 'Fruit', 'Dairy', 'Cooked Meal', 'Snack'].
        
        Return ONLY valid JSON. No conversational text.
        """

        for name in model_names:
            try:
                model = genai.GenerativeModel(name)
                response = model.generate_content([
                    {"mime_type": "image/jpeg", "data": image_bytes},
                    prompt
                ])
                # If we got here without exception, success!
                break
            except Exception as e:
                last_error = e
                logger.warning(f"[food_classifier] model {name} failed: {e}")
                continue
        
        if not response:
            raise last_error or ValueError("All Gemini models failed")

        text = response.text.strip()
        
        # Clean potential markdown formatting
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        data = json.loads(text)
        
        # If not food, return a clear 'Not Food' label
        if not data.get("is_food", True):
            return {
                "food_name": "Non-food item detected",
                "confidence": data.get("confidence", 90),
                "label_raw": "not_food",
                "top_predictions": [],
                "is_food": False,
            }

        return {
            "food_name": data.get("food_name", "Unknown Food"),
            "confidence": data.get("confidence", 85),
            "label_raw": data.get("food_name", "food").lower().replace(" ", "_"),
            "category": data.get("category", "Cooked Meal"), # New helpful field
            "top_predictions": [], 
            "is_food": True,
        }
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"[food_classifier] Gemini error: {error_msg}")
        
        # We return the error in 'food_name' so it's visible in the UI
        return {
            "food_name": f"AI Error: {error_msg[:50]}...",
            "confidence": 0,
            "label_raw": "error",
            "top_predictions": [],
            "is_food": False,
        }
