"""
ngo_engine.py
=============
AI-powered NGO recommendation engine for SharePlate.

Scoring weights (total = 100 pts):
  - Capacity match   : 30 pts
  - Food-type match  : 30 pts
  - Urgency / expiry : 20 pts
  - Distance         : 20 pts

Final match_percentage = min(score, 99)
"""

import math
import re
from typing import Optional

# ---------------------------------------------------------------------------
# City → approximate GPS lookup (avoids external API dependency)
# ---------------------------------------------------------------------------

CITY_COORDS: dict[str, tuple[float, float]] = {
    "delhi": (28.6139, 77.2090),
    "new delhi": (28.6139, 77.2090),
    "mumbai": (19.0760, 72.8777),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "chennai": (13.0827, 80.2707),
    "hyderabad": (17.3850, 78.4867),
    "kolkata": (22.5726, 88.3639),
    "pune": (18.5204, 73.8567),
    "ahmedabad": (23.0225, 72.5714),
    "jaipur": (26.9124, 75.7873),
    "lucknow": (26.8467, 80.9462),
    "surat": (21.1702, 72.8311),
    "bhopal": (23.2599, 77.4126),
    "patna": (25.5941, 85.1376),
    "indore": (22.7196, 75.8577),
    "nagpur": (21.1458, 79.0882),
    "visakhapatnam": (17.6868, 83.2185),
    "coimbatore": (11.0168, 76.9558),
    "kochi": (9.9312, 76.2673),
}

FOOD_TYPE_KEYWORDS = {
    "dairy":    ["milk", "dairy", "cheese", "yogurt", "curd", "paneer",
                 "butter", "cream", "ghee", "lassi", "buttermilk"],
    "cooked":   ["rice", "dal", "curry", "sabzi", "roti", "chapati",
                 "biryani", "khichdi", "idli", "dosa", "sambar", "soup",
                 "cooked", "meal", "food", "lunch", "dinner", "breakfast"],
    "dry":      ["biscuit", "chips", "packet", "packaged", "canned",
                 "sealed", "flour", "pasta", "noodles", "instant", "cereal",
                 "granola", "crackers", "snack", "chocolate", "candy",
                 "jam", "pickle", "dry", "grain"],
    "perishable": ["fruit", "vegetable", "salad", "juice", "bread",
                   "cake", "pastry", "fresh", "raw", "meat", "fish",
                   "egg", "eggs"],
}


# ---------------------------------------------------------------------------
# Haversine distance
# ---------------------------------------------------------------------------

def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return distance in kilometres between two GPS coordinates."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ---------------------------------------------------------------------------
# Location → GPS
# ---------------------------------------------------------------------------

def _location_to_coords(location: str) -> Optional[tuple[float, float]]:
    """
    Extract city name from a free-text location string and return GPS coords.
    Falls back to None if no known city is found.
    """
    location_lower = location.lower()
    for city, coords in CITY_COORDS.items():
        if city in location_lower:
            return coords
    return None


# ---------------------------------------------------------------------------
# Food-type classifier
# ---------------------------------------------------------------------------

def _classify_food(food_name: str) -> str:
    """Return food type: 'dairy' | 'cooked' | 'perishable' | 'dry' | 'any'"""
    food_lower = food_name.lower()
    for food_type, keywords in FOOD_TYPE_KEYWORDS.items():
        if any(kw in food_lower for kw in keywords):
            return food_type
    return "any"


# ---------------------------------------------------------------------------
# Parse quantity
# ---------------------------------------------------------------------------

def _parse_quantity(quantity: str) -> float:
    match = re.search(r"(\d+(\.\d+)?)", str(quantity))
    return float(match.group(1)) if match else 0.0


# ---------------------------------------------------------------------------
# Main scoring function
# ---------------------------------------------------------------------------

def score_ngo(
    ngo: dict,
    food_name: str,
    quantity: str,
    priority: str,
    donor_lat: Optional[float],
    donor_lng: Optional[float],
) -> dict:
    """
    Score a single NGO against a donation and return a result dict:
    {
        "ngo_id":          str,
        "name":            str,
        "distance_km":     float | None,
        "match_percentage": int,
        "speciality":      list[str],
        "contact":         str,
        "city":            str,
    }
    """
    score = 0
    food_type = _classify_food(food_name)
    qty = _parse_quantity(quantity)

    # --- 1. Capacity match (30 pts) ---
    ngo_capacity = ngo.get("capacity", "medium").lower()
    if qty > 100:
        if ngo_capacity == "large":
            score += 30
        elif ngo_capacity == "medium":
            score += 15
        else:
            score += 5
    elif qty > 30:
        if ngo_capacity == "medium":
            score += 30
        elif ngo_capacity == "large":
            score += 22
        else:
            score += 10
    else:
        if ngo_capacity == "small":
            score += 30
        elif ngo_capacity == "medium":
            score += 22
        else:
            score += 15

    # --- 2. Food-type match (30 pts) ---
    ngo_specialities = [s.lower() for s in ngo.get("speciality", ["any"])]
    if "any" in ngo_specialities:
        score += 20  # generalist NGO — partial points
    elif food_type in ngo_specialities:
        score += 30
    elif food_type == "dairy" and "perishable" in ngo_specialities:
        score += 22  # dairy is perishable — decent match
    elif food_type == "perishable" and "dairy" in ngo_specialities:
        score += 18
    else:
        score += 5   # mismatch

    # --- 3. Urgency / priority match (20 pts) ---
    if priority == "HIGH":
        # Urgent — prefer NGOs that handle perishable / dairy
        if any(s in ngo_specialities for s in ["perishable", "dairy", "cooked"]):
            score += 20
        else:
            score += 10
    elif priority == "MEDIUM":
        score += 15
    else:  # LOW
        score += 10

    # --- 4. Distance score (20 pts) ---
    distance_km: Optional[float] = None
    ngo_lat = ngo.get("lat")
    ngo_lng = ngo.get("lng")

    if donor_lat is not None and ngo_lat is not None:
        distance_km = round(_haversine(donor_lat, donor_lng, ngo_lat, ngo_lng), 2)
        if distance_km <= 2:
            score += 20
        elif distance_km <= 5:
            score += 17
        elif distance_km <= 10:
            score += 13
        elif distance_km <= 20:
            score += 8
        elif distance_km <= 50:
            score += 4
        else:
            score += 1
    else:
        # No GPS data — neutral
        score += 10

    return {
        "ngo_id":           str(ngo.get("_id", "")),
        "name":             ngo.get("name", "Unknown NGO"),
        "city":             ngo.get("city", ""),
        "distance_km":      distance_km,
        "match_percentage": min(score, 99),
        "speciality":       ngo.get("speciality", []),
        "contact":          ngo.get("contact", ""),
        "capacity":         ngo.get("capacity", ""),
    }


def recommend_ngo(
    ngos: list[dict],
    food_name: str,
    quantity: str,
    priority: str,
    location: str,
) -> Optional[dict]:
    """
    Score all active NGOs and return the best match.
    Returns None if no NGOs are available.
    """
    if not ngos:
        return None

    donor_coords = _location_to_coords(location)
    donor_lat = donor_coords[0] if donor_coords else None
    donor_lng = donor_coords[1] if donor_coords else None

    scored = [
        score_ngo(ngo, food_name, quantity, priority, donor_lat, donor_lng)
        for ngo in ngos
        if ngo.get("active", True)
    ]

    if not scored:
        return None

    return max(scored, key=lambda x: x["match_percentage"])
