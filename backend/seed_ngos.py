"""
seed_ngos.py
============
Run once to populate the 'ngos' collection in MongoDB with realistic mock data.

Usage:
    python seed_ngos.py
"""

from database import ngos_collection

NGOS = [
    # ── Delhi ──────────────────────────────────────────────────────────────
    {
        "name": "Roti Bank Delhi",
        "city": "Delhi",
        "lat": 28.6352, "lng": 77.2245,
        "capacity": "large",
        "speciality": ["cooked", "any"],
        "contact": "+91-98100-11223",
        "active": True,
        "description": "Distributes cooked meals to migrant workers and slum dwellers across Delhi.",
    },
    {
        "name": "Milk for All Foundation",
        "city": "Delhi",
        "lat": 28.5921, "lng": 77.0460,
        "capacity": "medium",
        "speciality": ["dairy", "perishable"],
        "contact": "+91-98110-44556",
        "active": True,
        "description": "Focused on distributing dairy products and perishables to children in need.",
    },

    # ── Mumbai ─────────────────────────────────────────────────────────────
    {
        "name": "Feed Mumbai Trust",
        "city": "Mumbai",
        "lat": 19.0522, "lng": 72.8311,
        "capacity": "large",
        "speciality": ["any"],
        "contact": "+91-22-2765-4321",
        "active": True,
        "description": "Large-scale food redistribution network serving 500+ families daily.",
    },
    {
        "name": "Dharavi Food Circle",
        "city": "Mumbai",
        "lat": 19.0411, "lng": 72.8558,
        "capacity": "medium",
        "speciality": ["cooked", "perishable"],
        "contact": "+91-98200-77889",
        "active": True,
        "description": "Community kitchen serving Dharavi with cooked meals and fresh produce.",
    },

    # ── Bengaluru ──────────────────────────────────────────────────────────
    {
        "name": "Akshaya Patra Bengaluru",
        "city": "Bengaluru",
        "lat": 12.9783, "lng": 77.6408,
        "capacity": "large",
        "speciality": ["cooked", "any"],
        "contact": "+91-80-3014-7777",
        "active": True,
        "description": "Runs the world's largest NGO-run mid-day meal programme.",
    },
    {
        "name": "Bangalore Dry Goods Drive",
        "city": "Bengaluru",
        "lat": 12.9352, "lng": 77.6245,
        "capacity": "small",
        "speciality": ["dry"],
        "contact": "+91-98450-33221",
        "active": True,
        "description": "Collects packaged and dry foods for distribution to orphanages.",
    },

    # ── Chennai ────────────────────────────────────────────────────────────
    {
        "name": "Chennai Food Bank",
        "city": "Chennai",
        "lat": 13.0569, "lng": 80.2425,
        "capacity": "large",
        "speciality": ["any"],
        "contact": "+91-44-2345-6789",
        "active": True,
        "description": "Largest food bank in Tamil Nadu — accepts all food types.",
    },
    {
        "name": "Marina Fresh Foods NGO",
        "city": "Chennai",
        "lat": 13.0500, "lng": 80.2824,
        "capacity": "small",
        "speciality": ["perishable", "dairy"],
        "contact": "+91-98401-22334",
        "active": True,
        "description": "Rescues perishable food from restaurants and markets near Marina Beach.",
    },

    # ── Hyderabad ──────────────────────────────────────────────────────────
    {
        "name": "Hyderabad Hunger Help",
        "city": "Hyderabad",
        "lat": 17.3950, "lng": 78.4744,
        "capacity": "medium",
        "speciality": ["cooked", "dry"],
        "contact": "+91-98490-55667",
        "active": True,
        "description": "Serves cooked meals and distributes dry rations to labour colonies.",
    },
    {
        "name": "Telangana Dairy Relief",
        "city": "Hyderabad",
        "lat": 17.4126, "lng": 78.4071,
        "capacity": "medium",
        "speciality": ["dairy", "perishable"],
        "contact": "+91-98491-88990",
        "active": True,
        "description": "Specialises in redistributing surplus dairy products from local farms.",
    },

    # ── Kolkata ────────────────────────────────────────────────────────────
    {
        "name": "Mother House Food Mission",
        "city": "Kolkata",
        "lat": 22.5449, "lng": 88.3546,
        "capacity": "large",
        "speciality": ["cooked", "any"],
        "contact": "+91-33-2249-8374",
        "active": True,
        "description": "Inspired by the legacy of Missionaries of Charity — serves the destitute.",
    },
    {
        "name": "Kolkata Packet Food Drive",
        "city": "Kolkata",
        "lat": 22.5958, "lng": 88.3699,
        "capacity": "small",
        "speciality": ["dry"],
        "contact": "+91-98300-14455",
        "active": True,
        "description": "Collects unopened packaged food from supermarkets and distributes to schools.",
    },
]


def seed():
    existing = ngos_collection.count_documents({})
    if existing > 0:
        print(f"[seed_ngos] Already found {existing} NGO(s) in DB — skipping seed.")
        print("  Delete the 'ngos' collection manually if you want to reseed.")
        return

    result = ngos_collection.insert_many(NGOS)
    print(f"[seed_ngos] Inserted {len(result.inserted_ids)} NGOs successfully.")


if __name__ == "__main__":
    seed()
