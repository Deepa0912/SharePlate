from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

MONGO_URL = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")

client = MongoClient(
    MONGO_URL,
    tls=True,
    tlsCAFile=certifi.where()
)

db = client["shareplate"]

users_collection     = db["users"]
donations_collection = db["donations"]
ngos_collection      = db["ngos"]