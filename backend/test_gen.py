import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

def test_gen():
    if not GEMINI_KEY: return
    client = genai.Client(api_key=GEMINI_KEY)
    
    # Try the specific names found in models.list()
    models_to_test = [
        "gemini-flash-latest",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
    ]
    
    for m in models_to_test:
        try:
            print(f"Testing {m}...")
            response = client.models.generate_content(model=m, contents="Hello")
            print(f"OK: {m}")
            return m
        except Exception as e:
            print(f"FAIL: {m} - {str(e)[:100]}")

if __name__ == "__main__":
    test_gen()
