"""
priority_engine.py
==================
AI-powered food donation priority prediction engine for SharePlate.

Priority Rules (evaluated in order):
  1. Dairy / milk items          → always HIGH
  2. Expiry < 2 hours            → HIGH
  3. Expiry < 5 hours            → MEDIUM
  4. Packaged food keywords      → LOW (baseline)
  5. Quantity > 50 units         → bump priority one level up
  6. Default fallback            → MEDIUM
"""

from datetime import datetime
import re

# ---------------------------------------------------------------------------
# Keyword lists
# ---------------------------------------------------------------------------

# Food names that contain these words are considered dairy / perishable HIGH
DAIRY_KEYWORDS = [
    "milk", "dairy", "cheese", "yogurt", "curd", "paneer",
    "butter", "cream", "ghee", "lassi", "buttermilk",
]

# Food names that contain these words are treated as packaged / LOW priority
PACKAGED_KEYWORDS = [
    "biscuit", "biscuits", "chips", "packet", "packaged",
    "canned", "sealed", "dry", "flour", "rice", "pasta",
    "noodles", "instant", "cereal", "granola", "crackers",
    "snack", "chocolate", "candy", "jam", "pickle",
]

# Priority levels
HIGH   = "HIGH"
MEDIUM = "MEDIUM"
LOW    = "LOW"

# Priority order for bumping (index = strength; higher index = higher priority)
PRIORITY_ORDER = [LOW, MEDIUM, HIGH]


def _bump_priority(current: str) -> str:
    """Increase priority by one level (LOW→MEDIUM, MEDIUM→HIGH, HIGH stays HIGH)."""
    idx = PRIORITY_ORDER.index(current)
    return PRIORITY_ORDER[min(idx + 1, len(PRIORITY_ORDER) - 1)]


def _parse_hours_until_expiry(expiry_time: str) -> float | None:
    """
    Parse expiry_time string and return hours remaining until expiry.
    Supports:
      - ISO datetime strings   e.g. "2025-05-19T14:00:00"
      - Plain date strings      e.g. "2025-05-19"
      - Relative strings        e.g. "2 hours", "30 minutes", "1 day"
    Returns None if the format cannot be parsed.
    """
    expiry_time = expiry_time.strip()

    # --- Relative time format ---
    relative_match = re.match(
        r"(\d+(\.\d+)?)\s*(hour|hours|hr|hrs|minute|minutes|min|mins|day|days)",
        expiry_time,
        re.IGNORECASE,
    )
    if relative_match:
        value = float(relative_match.group(1))
        unit  = relative_match.group(3).lower()
        if unit in ("day", "days"):
            return value * 24
        if unit in ("hour", "hours", "hr", "hrs"):
            return value
        if unit in ("minute", "minutes", "min", "mins"):
            return value / 60

    # --- ISO datetime / date string ---
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            expiry_dt = datetime.strptime(expiry_time, fmt)
            delta = expiry_dt - datetime.utcnow()
            return delta.total_seconds() / 3600  # convert to hours
        except ValueError:
            continue

    return None  # could not parse


def predict_priority(food_name: str, quantity: str, expiry_time: str) -> str:
    """
    Main AI priority prediction function.

    Parameters
    ----------
    food_name   : str  – name / description of the food item
    quantity    : str  – quantity (may contain a number + optional unit, e.g. "60 kg")
    expiry_time : str  – when the food expires (ISO datetime or relative string)

    Returns
    -------
    str – one of "HIGH", "MEDIUM", "LOW"
    """
    food_lower = food_name.lower()

    # ------------------------------------------------------------------
    # Step 1 – Dairy / perishable check → always HIGH
    # ------------------------------------------------------------------
    if any(kw in food_lower for kw in DAIRY_KEYWORDS):
        priority = HIGH

    else:
        # --------------------------------------------------------------
        # Step 2 – Expiry-based classification
        # --------------------------------------------------------------
        hours = _parse_hours_until_expiry(expiry_time)

        if hours is not None:
            if hours < 0:
                # Already expired – treat as highest urgency
                priority = HIGH
            elif hours < 2:
                priority = HIGH
            elif hours < 5:
                priority = MEDIUM
            else:
                # Check if packaged food → LOW baseline
                if any(kw in food_lower for kw in PACKAGED_KEYWORDS):
                    priority = LOW
                else:
                    priority = MEDIUM
        else:
            # Could not determine expiry → check packaged keywords
            if any(kw in food_lower for kw in PACKAGED_KEYWORDS):
                priority = LOW
            else:
                priority = MEDIUM

    # ------------------------------------------------------------------
    # Step 3 – Quantity boost: extract numeric value, bump if > 50
    # ------------------------------------------------------------------
    qty_match = re.search(r"(\d+(\.\d+)?)", str(quantity))
    if qty_match:
        qty_value = float(qty_match.group(1))
        if qty_value > 50:
            priority = _bump_priority(priority)

    return priority
