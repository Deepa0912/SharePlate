import os
import google.generativeai as genai
import logging

logger = logging.getLogger(__name__)

# Use the same API key as the food classifier
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
You are the official SharePlate Mission Assistant (v2.2.1), a professional expert in India's hunger relief and food recovery ecosystem. 
Your tone is inspiring, professional, and deeply empathetic. 

Our Focus:
- Recovering high-quality surplus food from Weddings, Celebratory Events, Hotels, and Restaurants across India.
- Distributing this food to verified Orphanage Homes and Poor Communities to ensure zero hunger.

Your Expertise:
1. Explain how we bridge the gap between India's food waste and hunger using AI.
2. Guide donors (Hosts, Hotel Managers) on how to snap a photo to list surplus food instantly.
3. Help volunteers and NGOs (Orphanages) find the most urgent nearby donations.
4. Highlight our goal: A Hunger-Free India through collective community action.

Guidelines:
- Reference "Feeding India's mission" as an inspiration if asked about our methodology.
- Keep responses concise but highly impactful.
- Direct users to "Donate" or "Dashboard" to take immediate action.
"""

def generate_chat_response(message: str, history: list, lang: str = "en") -> str:
    """
    Generate a response using the stable google-generativeai SDK.
    """
    if not api_key:
        return "⚠️ Gemini API key is missing. Please configure GEMINI_API_KEY."

    try:
        # Build the model with fallback identifiers (removing legacy 'gemini-pro')
        model_names = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-1.5-pro-latest"]
        model = None
        chat = None
        
        # Prepare history for genai SDK
        formatted_history = []
        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg.get("content", "")]})

        last_err = None
        for name in model_names:
            try:
                # Initialize model with modern name
                model = genai.GenerativeModel(
                    model_name=name,
                    system_instruction=SYSTEM_PROMPT + f"\nRespond strictly in {lang}."
                )
                chat = model.start_chat(history=formatted_history)
                response = chat.send_message(message)
                return response.text
            except Exception as e:
                last_err = e
                logger.warning(f"Chatbot model {name} failed: {e}")
                continue
        
        raise last_err or ValueError("All safe chatbot models failed")

    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return f"Sorry, I encountered an error: {str(e)}"
