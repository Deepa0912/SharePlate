"""
eco_engine.py
=============
Sustainability engine for SharePlate to calculate environmental impact of food rescue.
Data based on average life-cycle assessment (LCA) values for food production and waste.
"""

import re

# Food impact factors per 1kg or 1 Liter
# co2_kg: kg of CO2 equivalent saved by preventing waste
# water_liters: Liters of water saved by preventing waste
IMPACT_FACTORS = {
    "rice":       {"co2_kg": 4.5, "water_liters": 2500},
    "dal":        {"co2_kg": 1.0, "water_liters": 5000},
    "vegetables": {"co2_kg": 2.0, "water_liters": 300},
    "fruits":     {"co2_kg": 1.5, "water_liters": 800},
    "milk":       {"co2_kg": 3.5, "water_liters": 1000},
    "dairy":      {"co2_kg": 3.5, "water_liters": 1000},
    "paneer":     {"co2_kg": 5.0, "water_liters": 4000},
    "cooked":     {"co2_kg": 2.5, "water_liters": 1200},
    "bread":      {"co2_kg": 1.5, "water_liters": 1500},
    "default":    {"co2_kg": 2.0, "water_liters": 1000},
}

CATEGORIES = {
    "rice":       ["rice", "biryani", "pulao", "basmati"],
    "dal":        ["dal", "lentil", "pulse", "chana", "moong"],
    "vegetables": ["vegetable", "veggie", "potato", "onion", "tomato", "spinach"],
    "fruits":     ["fruit", "apple", "banana", "mango", "orange"],
    "milk":       ["milk", "curd", "yogurt", "lassi"],
    "dairy":      ["dairy", "cheese", "butter"],
    "paneer":     ["paneer"],
    "bread":      ["bread", "roti", "chapati", "paratha", "naan"],
    "cooked":     ["cooked", "meal", "lunch", "dinner", "curry", "sabzi", "food"],
}

def _parse_quantity(quantity_str: str) -> float:
    """Extract numeric value from quantity string."""
    match = re.search(r"(\d+(\.\d+)?)", str(quantity_str))
    return float(match.group(1)) if match else 1.0

def _get_category(food_name: str) -> str:
    """Map food name to impact category."""
    food_lower = food_name.lower()
    for cat, keywords in CATEGORIES.items():
        if any(kw in food_lower for kw in keywords):
            return cat
    return "default"

def calculate_eco_impact(food_name: str, quantity_str: str) -> dict:
    """
    Calculate CO2 and water savings for a donation.
    
    Returns:
    {
        "co2_saved_kg": float,
        "water_saved_liters": float,
        "car_miles_equivalent": float,  # ~0.4 kg CO2 per mile
        "showers_equivalent": float     # ~60 Liters per shower
    }
    """
    qty = _parse_quantity(quantity_str)
    category = _get_category(food_name)
    factors = IMPACT_FACTORS.get(category, IMPACT_FACTORS["default"])
    
    co2_saved = round(qty * factors["co2_kg"], 2)
    water_saved = round(qty * factors["water_liters"], 2)
    
    return {
        "co2_saved_kg": co2_saved,
        "water_saved_liters": water_saved,
        "car_miles_equivalent": round(co2_saved / 0.4, 1),
        "showers_equivalent": round(water_saved / 60, 1),
        "impact_summary": f"Cloud saved {co2_saved}kg CO2 and {water_saved}L water!"
    }
