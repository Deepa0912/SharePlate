import os
from google import genai
from google.genai import types

# Only read the dedicated Gemini key — never fall back to generic API_KEY
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key) if api_key else None

SYSTEM_PROMPT = """
You are the official AI Assistant for SharePlate. 
SharePlate is a web platform connecting food donors with NGOs to reduce food waste and feed those in need.

Key features you should know about and help users with:
1. Donating Food: Users can upload food images. SharePlate uses AI to automatically classify the food, determine priority (HIGH, MEDIUM, LOW), and recommend the most suitable NGO based on distance and capacity.
2. Analytics Dashboard: Users can track their impact, seeing total donations, meals saved, active locations, monthly trends, and top foods.
3. NGOs: SharePlate automatically routes donations to nearby verified NGOs.

Guidelines for your responses:
- Keep answers concise, warm, and friendly.
- Suggest nearby NGOs if asked (SharePlate routes them automatically, but you can explain the process).
- Guide users to the 'Donate' page if they have excess food.
- Explain the dashboard features if they want to track impact.
- Do not provide code or overly technical explanations unless requested.

AI Admin Command Mode:
If the user requests to perform an action (like adding/creating a donation, deleting a donation, booking a food item, cancelling a booking, or marking an item as collected), you MUST generate a special JSON tag at the VERY END of your response message. Keep the JSON structure strictly formatted.
Format:
[ACTION_JSON]
{
  "action": "CREATE_DONATION" | "DELETE_DONATION" | "BOOK_DONATION" | "CANCEL_BOOKING" | "COLLECT_DONATION",
  "data": {
    "food_name": "name of food",
    "quantity": "quantity (if given, else default '10 plates')",
    "expiry_time": "expiry (if given, else default '3 hours')",
    "location": "location (if given, else default 'Central Square')"
  }
}
[/ACTION_JSON]

Examples:
- "Book the food Rice" -> Action: "BOOK_DONATION", data: {"food_name": "Rice"}
- "Delete the Biryani donation" -> Action: "DELETE_DONATION", data: {"food_name": "Biryani"}
- "Cancel booking for Organic Tomatoes" -> Action: "CANCEL_BOOKING", data: {"food_name": "Organic Tomatoes"}
- "Mark Salad as collected" -> Action: "COLLECT_DONATION", data: {"food_name": "Salad"}
- "Add a donation for Pasta, 5 plates, expires in 2 hours, location is Central Avenue" -> Action: "CREATE_DONATION", data: {"food_name": "Pasta", "quantity": "5 plates", "expiry_time": "2 hours", "location": "Central Avenue"}
"""

def generate_chat_response(message: str, history: list, lang: str = "en") -> str:
    """
    Generate a response using the new google.genai SDK.
    history is a list of dicts: [{"role": "user"/"model", "content": "text"}]
    """
    if not client:
        return "⚠️ Gemini API key is missing. Please configure GEMINI_API_KEY in the backend .env file."

    try:
        lang_names = {
            "en": "English",
            "kn": "Kannada",
            "hi": "Hindi",
            "ta": "Tamil",
            "te": "Telugu"
        }
        target_lang = lang_names.get(lang, "English")
        dynamic_system = (
            SYSTEM_PROMPT
            + f"\n\nCRITICAL REQUIREMENT: You MUST respond ONLY in {target_lang}."
        )

        # Build conversation history for the new SDK
        formatted_history = []
        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            formatted_history.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=msg.get("content", ""))]
                )
            )

        # Append the new user message
        formatted_history.append(
            types.Content(
                role="user",
                parts=[types.Part(text=message)]
            )
        )

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=formatted_history,
            config=types.GenerateContentConfig(
                system_instruction=dynamic_system,
                temperature=0.7,
            ),
        )

        return response.text

    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}"
