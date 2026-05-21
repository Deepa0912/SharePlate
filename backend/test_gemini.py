import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

def test_models():
    if not GEMINI_KEY:
        print("No key found")
        return
    client = genai.Client(api_key=GEMINI_KEY)
    try:
        print("Fetching models...")
        for model in client.models.list():
            print(f"- {model.name}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_models()
