"""
seed_donations.py
=================
Populates the 'donations' collection with realistic historical mock data
so that the analytics charts display beautiful, populated graphs.
"""

import sys
import os
from datetime import datetime, timedelta
import random

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database import donations_collection

# Realistic mock images (Unsplash public food/produce images)
MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=cover&w=600&q=80",  # Pizza
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=cover&w=600&q=80",  # Biryani
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=cover&w=600&q=80",  # Salad
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=cover&w=600&q=80",  # Bread
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=cover&w=600&q=80",  # Burger
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=cover&w=600&q=80",  # Pizza 2
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=cover&w=600&q=80",  # Pasta
]

MOCK_FOODS = [
    ("Pizza", "3 boxes", "HIGH"),
    ("Biryani / Rice", "40 plates", "HIGH"),
    ("Salad", "15 portions", "LOW"),
    ("Bread", "20 loaves", "MEDIUM"),
    ("Paneer Curry", "8 kg", "HIGH"),
    ("Banana", "5 dozen", "MEDIUM"),
    ("Cabbage", "10 kg", "LOW"),
    ("Hamburger / Burger", "25 servings", "HIGH"),
    ("Spaghetti / Pasta", "12 portions", "MEDIUM"),
    ("Omelette / Egg", "30 portions", "HIGH"),
    ("Ice Cream", "5 litres", "HIGH"),
    ("Samosa / Snack", "60 pieces", "MEDIUM")
]

MOCK_LOCATIONS = [
    "Koramangala, Bengaluru",
    "Connaught Place, Delhi",
    "Andheri West, Mumbai",
    "Adyar, Chennai",
    "Gachibowli, Hyderabad",
    "Whitefield, Bengaluru",
    "Saket, Delhi",
    "Bandra, Mumbai",
]

def seed_donations():
    # Clear existing donations to have a fresh, predictable timeline for beautiful graphs
    count_before = donations_collection.count_documents({})
    if count_before > 5:
        print(f"[seed_donations] Already found {count_before} donations. Skipping seed.")
        return

    print("Seeding realistic historical donations...")
    
    now = datetime.utcnow()
    donations = []

    # Let's seed 25 donations spread over the last 5 months
    for i in range(25):
        food_name, qty, priority = random.choice(MOCK_FOODS)
        location = random.choice(MOCK_LOCATIONS)
        
        # Spread dates back up to 140 days
        days_back = random.randint(2, 140)
        date_created = now - timedelta(days=days_back, hours=random.randint(1, 23))
        
        donation = {
            "food_name": food_name,
            "quantity": qty,
            "expiry_time": f"{random.randint(4, 36)} hours",
            "location": location,
            "donor_id": f"donor_{random.randint(101, 108)}",
            "image_url": random.choice(MOCK_IMAGES),
            "status": random.choice(["Pending", "Approved", "Completed"]),
            "priority": priority,
            "created_at": date_created.isoformat() + "Z"
        }
        donations.append(donation)

    # Insert
    donations_collection.insert_many(donations)
    print(f"Successfully seeded {len(donations)} donations.")

if __name__ == "__main__":
    seed_donations()
