import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

def test_rest():
    if not GEMINI_KEY: return
    
    # Try the v1 endpoint (more stable for some keys)
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
    
    payload = {
        "contents": [{
            "parts": [{"text": "Hello"}]
        }]
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        print("Testing REST v1...")
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            print("OK REST v1")
            return True
        else:
            print(f"FAILED REST v1 ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"ERROR REST v1: {e}")

    # Try the v1beta endpoint
    url_beta = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
    try:
        print("Testing REST v1beta...")
        response = requests.post(url_beta, headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            print("OK REST v1beta")
            return True
        else:
            print(f"FAILED REST v1beta ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"ERROR REST v1beta: {e}")

if __name__ == "__main__":
    test_rest()
