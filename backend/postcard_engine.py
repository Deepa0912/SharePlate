"""
postcard_engine.py
==================
Uses Google Gemini AI to generate personalized impact stories for donors.
These stories are intended for "Impact Postcards" that can be shared on social media.
"""

import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def generate_impact_postcard(donation: dict) -> dict:
    """
    Generate a personalized impact story for a donation.
    
    Parameters:
    donation (dict): Donation record including food_name, quantity, eco_impact, etc.
    
    Returns:
    dict: {
        "title": str,
        "message": str,
        "theme": str (color/vibe),
        "quote": str,
        "stats": list
    }
    """
    if not GEMINI_API_KEY:
        # Fallback story
        return {
            "title": f"The Journey of {donation.get('food_name', 'your gift')}",
            "message": f"Your generous donation of {donation.get('quantity')} has been successfully shared. Together, we've saved equivalent to {donation.get('eco_impact', {}).get('showers_equivalent', 0)} showers worth of water!",
            "theme": "emerald",
            "quote": "Feeding the hungry is the greatest virtue.",
            "stats": [
                f"{donation.get('quantity')} Shared",
                f"{donation.get('eco_impact', {}).get('co2_saved_kg', 0)}kg CO2 Saved"
            ]
        }

    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
You are a poetic storyteller for a food donation platform "SharePlate".
A donor just contributed:
- Food: {donation.get('food_name')}
- Quantity: {donation.get('quantity')}
- Eco Impact: {donation.get('eco_impact', {}).get('co2_saved_kg')}kg CO2 and {donation.get('eco_impact', {}).get('water_saved_liters')}L water saved.

Generate a heart-touching, ultra-short, poetic "Impact Story" for a social media postcard.
Make it sound inspirational and personal to the donor.

Respond ONLY with a valid JSON (no markdown):
{{
  "title": "Short poetic title (max 5 words)",
  "message": "Heart-touching story (max 30 words)",
  "theme": "A color name representing the vibe (e.g. Amber, Azure, Emerald, Sunset)",
  "quote": "A short inspirational quote about food or kindness",
  "stats": ["Statistic 1", "Statistic 2"]
}}
"""
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Clean markdown code blocks if present
        if text.startswith("```"):
            text = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()

        return json.loads(text)
    except Exception as e:
        print(f"[PostcardEngine] Gemini failed: {e}")
        # Return fallback if AI fails
        return {
            "title": "A Plate of Hope",
            "message": "Your kindness traveled from your hands to those who needed it most, saving our planet one meal at a time.",
            "theme": "Sunset",
            "quote": "Small acts, when multiplied by millions, can transform the world.",
            "stats": [f"{donation.get('quantity')} Shared", "Planet Healed"]
        }
