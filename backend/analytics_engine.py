"""
analytics_engine.py
===================
Analytics processing module for SharePlate.
Computes and groups donation statistics, monthly trends, and locations.
"""

import re
from datetime import datetime
from collections import Counter
from typing import Dict, List, Any

# Regular expression to extract number from quantity string (e.g. "10 kg", "50 plates", "3")
QTY_PATTERN = re.compile(r"(\d+(?:\.\d+)?)\s*(a-zA-Z*)", re.IGNORECASE)

def parse_meals_saved(quantity_str: str) -> float:
    """
    Heuristic/AI-like parsing to convert quantity strings into an estimated number of meals saved.
    
    Examples:
      - "10 kg" -> 10 * 2 = 20 meals
      - "50 plates" -> 50 * 1 = 50 meals
      - "15 packets" -> 15 * 1.5 = 22.5 meals
      - "5 boxes" -> 5 * 3 = 15 meals
      - "20" -> 20 * 1.2 = 24 meals
    """
    if not quantity_str:
        return 0.0

    # Clean the string
    cleaned = quantity_str.strip().lower()
    
    # Try to find a number at the start of the string
    match = re.match(r"^(\d+(?:\.\d+)?)\s*([a-zA-Z\s]*)", cleaned)
    if not match:
        # Fallback if no number matches at the start
        try:
            val = float(re.findall(r"\d+(?:\.\d+)?", cleaned)[0])
            return val * 1.2
        except Exception:
            return 1.0  # fallback baseline

    num_val = float(match.group(1))
    unit = match.group(2).strip()

    # Determine multiplier based on unit keywords
    if any(keyword in unit for keyword in ["kg", "kilogram", "kilo"]):
        multiplier = 2.0  # 1kg is approx 2 meals
    elif any(keyword in unit for keyword in ["plate", "serving", "portion", "person", "people"]):
        multiplier = 1.0  # 1 plate is 1 meal
    elif any(keyword in unit for keyword in ["packet", "pkt", "wrap", "roll"]):
        multiplier = 1.5  # 1 packet/wrap is roughly 1.5 meals
    elif any(keyword in unit for keyword in ["box", "container", "carton"]):
        multiplier = 3.0  # average size box contains multiple portions
    elif any(keyword in unit for keyword in ["bag", "sack"]):
        multiplier = 10.0 # large bag
    elif any(keyword in unit for keyword in ["litre", "liter", "l", "ml"]):
        multiplier = 1.2  # liquid volume
    else:
        multiplier = 1.2  # default fallback multiplier

    return round(num_val * multiplier, 1)

def compute_analytics(donations: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Process raw donation documents from MongoDB and compile clean analytics statistics.
    """
    total_donations = len(donations)
    total_meals = 0.0
    
    # Categorization structures
    food_counter = Counter()
    location_counter = Counter()
    
    # Monthly trend mapping
    # Month list sorted in chronological order (standard months)
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_data = {m: 0 for m in month_names}

    for d in donations:
        # 1. Meals Saved estimation
        qty = d.get("quantity", "")
        total_meals += parse_meals_saved(qty)

        # 2. Top foods (normalized to Title case)
        food_name = d.get("food_name", "Unknown Food").strip().title()
        if food_name:
            food_counter[food_name] += 1

        # 3. Busiest locations
        loc = d.get("location", "Unknown Location").strip().title()
        if loc:
            location_counter[loc] += 1

        # 4. Monthly trends
        created_at = d.get("created_at")
        if created_at:
            try:
                # Expecting ISO format 'YYYY-MM-DD...'
                dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                month_name = month_names[dt.month - 1]
                monthly_data[month_name] += 1
            except Exception:
                # Fallback to current month if parsing fails
                curr_month = month_names[datetime.utcnow().month - 1]
                monthly_data[curr_month] += 1
        else:
            # Fallback for old documents lacking created_at
            curr_month = month_names[datetime.utcnow().month - 1]
            monthly_data[curr_month] += 1

    # Format monthly trends for Recharts (list of dicts)
    # We return the last 6 months to make it clean, or all months that have data
    trend_list = []
    current_month_idx = datetime.utcnow().month - 1
    # Generate past 6 months chronologically
    for i in range(-5, 1):
        idx = (current_month_idx + i) % 12
        m_name = month_names[idx]
        trend_list.append({
            "month": m_name,
            "donations": monthly_data[m_name]
        })

    # Format Top Foods for Pie Chart (top 5)
    top_foods = [
        {"name": name, "value": count}
        for name, count in food_counter.most_common(5)
    ]

    # Format Busiest Locations for Bar Chart (top 5)
    top_locations = [
        {"location": loc, "donations": count}
        for loc, count in location_counter.most_common(5)
    ]

    # Return final payload
    return {
        "summary": {
            "total_donations": total_donations,
            "meals_saved": round(total_meals),
            "active_locations": len(location_counter),
        },
        "monthly_trends": trend_list,
        "top_foods": top_foods,
        "top_locations": top_locations
    }
