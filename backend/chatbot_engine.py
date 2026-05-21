import os
import logging
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

GEMINI_KEY = os.getenv("GEMINI_API_KEY")

SYSTEM_PROMPT = """You are the official SharePlate Mission Assistant. Your personality is helpful, empathetic, and professional.
You help users:
1. Find and share food listings (Weddings, Hotels, Restaurants surplus).
2. Classify food types from descriptions.
3. Answer questions about food safety, portions, and sharing etiquette in India.

Tone Guidelines:
- Be warm and human-like.
- Use meaningful emojis (❤️, 🙏, 🍲, ✨).
- Prioritize feeding the hungry and supporting orphanages.
"""

def generate_chat_response(message: str, history: list, lang: str = "en"):
    """
    Uses Google Gemini 1.5 Flash via the modern google-genai SDK.
    """
    if not GEMINI_KEY:
        return ("⚠️ AI Key Missing. Add a `GEMINI_API_KEY` to your backend .env file.", "No Engine")

    try:
        client = genai.Client(api_key=GEMINI_KEY)
        
        # Format history
        formatted_contents = []
        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            content = msg.get("content", "")
            if content:
                formatted_contents.append({"role": role, "parts": [{"text": content}]})

        # Add current message
        formatted_contents.append({"role": "user", "parts": [{"text": message}]})

        # System Instruction
        full_system_prompt = SYSTEM_PROMPT + f"\nRespond strictly in the language: {lang}."

        response = client.models.generate_content(
            model="gemini-flash-latest",
            config=types.GenerateContentConfig(
                system_instruction=full_system_prompt,
                temperature=0.7,
            ),
            contents=formatted_contents
        )

        return response.text, "Gemini 1.5 Flash (Free)"

    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        # Try a different model name variant if the first one fails (sometimes needed for certain regions)
        try:
            response = client.models.generate_content(
                model="models/gemini-1.5-flash",
                contents=formatted_contents
            )
            return response.text, "Gemini 1.5 Flash (Alt)"
        except Exception as e2:
            return (f"Oops! Gemini Error: {e2}", "Error")
