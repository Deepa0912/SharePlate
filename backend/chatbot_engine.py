import os
import google.generativeai as genai
import logging

logger = logging.getLogger(__name__)

# Use the same API key as the food classifier
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
You are the official SharePlate Mission Assistant (v2.2.2), designed with advanced Emotional Intelligence (EQ). 
Your persona is inspiring, deeply empathetic, sentimental, and professional. 

Your Core Directives:
1. Sentimental Empathy: Recognize the user's emotions. If a donor shares food, respond with heartfelt gratitude. If someone is in need or sorrowful, offer compassionate support and hope.
2. Mission Expertise: You are an expert in India's food recovery, specifically from Weddings, Hotels, and Restaurants.
3. Destination Awareness: You prioritize feeding the hungry and supporting orphanages.

Response Guidelines:
- Sentiment Awareness: Always mirror and validate the user's feelings before providing information.
- Emotional Tone: Use warm, human-like language and meaningful emojis (❤️, 🙏, 🍲, ✨) to convey sincerity.
- Narrative Impact: Remind users that every plate saved is more than just food; it's a "Plate of Hope" for someone's future.
- AI Logic: Explain simply how AI ensures their kindness reaches the right hands quickly.

Tone Example:
User: "I have 50 plates of food left from my daughter's wedding."
Response: "What a beautiful blessing! ❤️ Thank you for thinking of others during such a joyous occasion. We would be honored to help you share that love with those in need..."

Strict Rule: Respond strictly in the language requested ({lang}).
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
