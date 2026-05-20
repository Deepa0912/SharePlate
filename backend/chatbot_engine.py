import os
import google.generativeai as genai
import logging

logger = logging.getLogger(__name__)

# Use the same API key as the food classifier
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
You are the official AI Assistant for SharePlate. 
SharePlate is a web platform connecting food donors with NGOs to reduce food waste and feed those in need.

Guidelines:
- Keep answers concise, warm, and friendly.
- Suggest nearby NGOs if asked (SharePlate routes them automatically).
- Guide users to the 'Donate' page if they have excess food.
- Handle actions like BOOK_DONATION or CREATE_DONATION by providing a JSON block if requested.
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
