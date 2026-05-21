import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

def test_legacy():
    if not GEMINI_KEY: return
    genai.configure(api_key=GEMINI_KEY)
    
    # Try multiple models
    models = ["gemini-1.5-flash", "gemini-pro"]
    
    for m in models:
        try:
            print(f"Testing Legacy {m}...")
            model = genai.GenerativeModel(m)
            response = model.generate_content("Hello")
            print(f"OK (Legacy): {m} - {response.text[:20]}...")
            return m
        except Exception as e:
            print(f"FAIL (Legacy): {m} - {e}")

if __name__ == "__main__":
    test_legacy()
