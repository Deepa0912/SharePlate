from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

MONGO_URL = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("CRITICAL ERROR: 'MONGO_URI' environment variable is missing. Please add it to your Vercel/Render settings.")

client = MongoClient(
    MONGO_URL,
    tls=True,
    tlsCAFile=certifi.where()
)

db = client["shareplate"]

users_collection     = db["users"]
donations_collection = db["donations"]
ngos_collection      = db["ngos"]