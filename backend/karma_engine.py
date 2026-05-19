"""
karma_engine.py
===============
Gamified Donor Karma scoring engine for SharePlate.

Karma Points breakdown (per donation):
  - Base points         : 10  (every donation)
  - HIGH priority food  : +25 (urgent/perishable)
  - MEDIUM priority     : +15
  - LOW priority        : +8
  - Quantity bonus      : +1 per 10 units (max +30)
  - Fast collection     : +20 (collected within 1 hour of booking)
  - Collection done     : +15 (any collection)
  - Food type bonus     : +10 for dairy/cooked (hardest to preserve)

Tier thresholds:
  - 🥉 Bronze    : 0–199 pts
  - 🥈 Silver    : 200–499 pts
  - 🥇 Gold      : 500–999 pts
  - 💎 Platinum  : 1000+ pts
"""

import re
from datetime import datetime


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

TIER_THRESHOLDS = [
    (1000, "💎 Platinum"),
    (500,  "🥇 Gold"),
    (200,  "🥈 Silver"),
    (0,    "🥉 Bronze"),
]

HIGH_VALUE_FOODS = [
    "milk", "dairy", "cheese", "yogurt", "curd", "paneer", "butter",
    "cream", "ghee", "lassi", "rice", "dal", "curry", "sabzi", "roti",
    "chapati", "biryani", "khichdi", "idli", "dosa", "sambar", "soup",
    "cooked", "meal", "food", "lunch", "dinner",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_quantity(quantity: str) -> float:
    """Extract numeric value from quantity string."""
    match = re.search(r"(\d+(\.\d+)?)", str(quantity))
    return float(match.group(1)) if match else 0.0


def _hours_between(iso_a: str, iso_b: str) -> float | None:
    """Return hours between two ISO datetime strings. None on parse error."""
    try:
        dt_a = datetime.fromisoformat(iso_a.replace("Z", "+00:00"))
        dt_b = datetime.fromisoformat(iso_b.replace("Z", "+00:00"))
        return abs((dt_b - dt_a).total_seconds()) / 3600
    except Exception:
        return None


def get_tier(karma: int) -> str:
    """Return tier label for a given karma score."""
    for threshold, label in TIER_THRESHOLDS:
        if karma >= threshold:
            return label
    return "🥉 Bronze"


# ---------------------------------------------------------------------------
# Per-donation karma scoring
# ---------------------------------------------------------------------------

def score_donation(donation: dict) -> int:
    """Compute karma points for a single donation document."""
    points = 10  # base

    # Priority bonus
    priority = donation.get("priority", "MEDIUM")
    if priority == "HIGH":
        points += 25
    elif priority == "MEDIUM":
        points += 15
    else:
        points += 8

    # Quantity bonus (up to +30)
    qty = _parse_quantity(donation.get("quantity", "0"))
    points += min(int(qty // 10), 30)

    # High-value food type bonus
    food_name_lower = donation.get("food_name", "").lower()
    if any(kw in food_name_lower for kw in HIGH_VALUE_FOODS):
        points += 10

    # Collection bonuses
    status = donation.get("status", "")
    if status == "Collected":
        points += 15  # collection done
        # Fast collection bonus (< 1 hour from booking to collection)
        booked_at = donation.get("booked_at")
        collected_at = donation.get("collected_at")
        if booked_at and collected_at:
            hours_to_collect = _hours_between(booked_at, collected_at)
            if hours_to_collect is not None and hours_to_collect <= 1.0:
                points += 20  # fast rescue bonus

    return points


# ---------------------------------------------------------------------------
# Aggregate karma for a user
# ---------------------------------------------------------------------------

def compute_user_karma(email: str, all_donations: list[dict]) -> dict:
    """
    Compute total karma for a donor identified by email.

    Returns:
    {
        "email":          str,
        "karma":          int,
        "tier":           str,
        "donations_made": int,
        "meals_rescued":  int,
        "breakdown": {
            "base_points":       int,
            "priority_bonus":    int,
            "quantity_bonus":    int,
            "food_type_bonus":   int,
            "collection_bonus":  int,
        }
    }
    """
    donor_donations = [d for d in all_donations if d.get("donor_id") == email]

    total_karma = 0
    meals_rescued = 0

    base_points_total = 0
    priority_bonus_total = 0
    quantity_bonus_total = 0
    food_bonus_total = 0
    collection_bonus_total = 0

    for donation in donor_donations:
        # Score components
        base = 10
        priority = donation.get("priority", "MEDIUM")
        p_bonus = 25 if priority == "HIGH" else (15 if priority == "MEDIUM" else 8)
        qty = _parse_quantity(donation.get("quantity", "0"))
        q_bonus = min(int(qty // 10), 30)
        food_lower = donation.get("food_name", "").lower()
        f_bonus = 10 if any(kw in food_lower for kw in HIGH_VALUE_FOODS) else 0

        c_bonus = 0
        status = donation.get("status", "")
        if status == "Collected":
            c_bonus += 15
            booked_at = donation.get("booked_at")
            collected_at = donation.get("collected_at")
            if booked_at and collected_at:
                hours_to_collect = _hours_between(booked_at, collected_at)
                if hours_to_collect is not None and hours_to_collect <= 1.0:
                    c_bonus += 20
            # Estimate meals rescued
            meals_rescued += max(1, int(qty * 1.5))

        donation_karma = base + p_bonus + q_bonus + f_bonus + c_bonus
        total_karma += donation_karma

        base_points_total += base
        priority_bonus_total += p_bonus
        quantity_bonus_total += q_bonus
        food_bonus_total += f_bonus
        collection_bonus_total += c_bonus

    return {
        "email":          email,
        "karma":          total_karma,
        "tier":           get_tier(total_karma),
        "donations_made": len(donor_donations),
        "meals_rescued":  meals_rescued,
        "breakdown": {
            "base_points":      base_points_total,
            "priority_bonus":   priority_bonus_total,
            "quantity_bonus":   quantity_bonus_total,
            "food_type_bonus":  food_bonus_total,
            "collection_bonus": collection_bonus_total,
        },
    }


# ---------------------------------------------------------------------------
# Leaderboard builder
# ---------------------------------------------------------------------------

def build_leaderboard(all_donations: list[dict], top_n: int = 10) -> list[dict]:
    """
    Build a ranked leaderboard from all donation records.
    Returns list of top_n donors sorted by karma descending.
    """
    # Gather unique donor emails
    donor_emails = {d.get("donor_id", "") for d in all_donations if d.get("donor_id")}

    # Score each donor
    scored = [
        compute_user_karma(email, all_donations)
        for email in donor_emails
    ]

    # Sort by karma descending
    scored.sort(key=lambda x: x["karma"], reverse=True)

    # Add rank and mask email for display
    ranked = []
    for i, entry in enumerate(scored[:top_n]):
        display_email = entry["email"]
        # Mask: john.doe@gmail.com → jo***@gmail.com
        parts = display_email.split("@")
        if len(parts) == 2:
            name, domain = parts
            masked = name[:2] + "***@" + domain if len(name) > 2 else name + "@" + domain
        else:
            masked = display_email[:4] + "***"

        ranked.append({
            "rank":           i + 1,
            "email":          entry["email"],
            "display_name":   masked,
            "karma":          entry["karma"],
            "tier":           entry["tier"],
            "donations_made": entry["donations_made"],
            "meals_rescued":  entry["meals_rescued"],
        })

    return ranked
