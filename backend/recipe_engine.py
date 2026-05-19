"""
recipe_engine.py
================
AI-powered meal recipe suggestion engine for SharePlate.

Uses Google Gemini API (if key configured) to generate contextual Indian
meal recipes from donated food items. Falls back to a curated rule-based
recipe database if Gemini is unavailable.

Returns 3 recipe suggestions with:
  - recipe_name     : human-readable name
  - description     : 1-line description
  - servings        : estimated servings from the quantity
  - cook_time       : estimated cooking time
  - ingredients     : list of main ingredients
  - difficulty      : Easy / Medium / Hard
  - emoji           : visual indicator
"""

import os
import re
import json
import math
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# ---------------------------------------------------------------------------
# Rule-based recipe database (curated Indian + universal meals)
# ---------------------------------------------------------------------------

RECIPE_DATABASE = {
    # Rice-based
    "rice": [
        {
            "recipe_name": "Vegetable Khichdi",
            "description": "Nutritious one-pot rice and lentil dish — perfect for mass serving",
            "cook_time": "25 mins",
            "ingredients": ["rice", "moong dal", "vegetables", "turmeric", "ghee"],
            "difficulty": "Easy",
            "emoji": "🍲",
            "servings_per_kg": 8,
        },
        {
            "recipe_name": "Steamed Rice with Dal",
            "description": "Simple, wholesome staple that feeds large groups efficiently",
            "cook_time": "20 mins",
            "ingredients": ["rice", "toor dal", "salt", "water"],
            "difficulty": "Easy",
            "emoji": "🍚",
            "servings_per_kg": 6,
        },
        {
            "recipe_name": "Tomato Rice (Puliyodharai)",
            "description": "Tangy South Indian rice dish with minimal ingredients",
            "cook_time": "30 mins",
            "ingredients": ["rice", "tomatoes", "mustard seeds", "curry leaves", "spices"],
            "difficulty": "Medium",
            "emoji": "🍅",
            "servings_per_kg": 7,
        },
    ],
    "biryani": [
        {
            "recipe_name": "Vegetable Biryani",
            "description": "Aromatic layered rice dish with mixed vegetables",
            "cook_time": "45 mins",
            "ingredients": ["basmati rice", "mixed vegetables", "whole spices", "saffron"],
            "difficulty": "Medium",
            "emoji": "🍛",
            "servings_per_kg": 5,
        },
    ],
    # Dal / Lentils
    "dal": [
        {
            "recipe_name": "Dal Tadka",
            "description": "Classic tempered lentil curry — feeds large groups perfectly",
            "cook_time": "30 mins",
            "ingredients": ["toor dal", "onion", "tomato", "garlic", "cumin"],
            "difficulty": "Easy",
            "emoji": "🥘",
            "servings_per_kg": 10,
        },
        {
            "recipe_name": "Dal Soup",
            "description": "Light, protein-rich soup — great for children and elders",
            "cook_time": "20 mins",
            "ingredients": ["masoor dal", "ginger", "turmeric", "lime"],
            "difficulty": "Easy",
            "emoji": "🍵",
            "servings_per_kg": 12,
        },
    ],
    # Bread / Roti
    "roti": [
        {
            "recipe_name": "Roti with Sabzi",
            "description": "Classic Indian flatbread paired with seasonal vegetable curry",
            "cook_time": "30 mins",
            "ingredients": ["whole wheat flour", "water", "salt", "oil"],
            "difficulty": "Easy",
            "emoji": "🫓",
            "servings_per_kg": 15,
        },
    ],
    "bread": [
        {
            "recipe_name": "Bread Upma",
            "description": "Quick savory dish from stale bread — reduces food waste",
            "cook_time": "15 mins",
            "ingredients": ["bread", "onion", "green chili", "mustard seeds", "curry leaves"],
            "difficulty": "Easy",
            "emoji": "🍞",
            "servings_per_kg": 10,
        },
        {
            "recipe_name": "Bread Halwa",
            "description": "Sweet dessert from bread — popular with children",
            "cook_time": "20 mins",
            "ingredients": ["bread", "milk", "sugar", "ghee", "cardamom"],
            "difficulty": "Easy",
            "emoji": "🍮",
            "servings_per_kg": 8,
        },
    ],
    # Vegetables
    "vegetables": [
        {
            "recipe_name": "Mixed Vegetable Curry",
            "description": "Hearty curry with any seasonal vegetables available",
            "cook_time": "35 mins",
            "ingredients": ["mixed vegetables", "onion", "tomato", "spices", "oil"],
            "difficulty": "Easy",
            "emoji": "🥗",
            "servings_per_kg": 6,
        },
        {
            "recipe_name": "Vegetable Stew",
            "description": "Light Kerala-style coconut stew — easy to digest",
            "cook_time": "30 mins",
            "ingredients": ["vegetables", "coconut milk", "green chili", "curry leaves"],
            "difficulty": "Medium",
            "emoji": "🥣",
            "servings_per_kg": 7,
        },
        {
            "recipe_name": "Stir-Fried Sabzi",
            "description": "Quick dry-fried vegetable side dish with minimal oil",
            "cook_time": "15 mins",
            "ingredients": ["vegetables", "mustard seeds", "turmeric", "red chili"],
            "difficulty": "Easy",
            "emoji": "🥬",
            "servings_per_kg": 5,
        },
    ],
    # Dairy
    "milk": [
        {
            "recipe_name": "Kheer (Rice Pudding)",
            "description": "Traditional sweet rice pudding — beloved by all ages",
            "cook_time": "40 mins",
            "ingredients": ["milk", "rice", "sugar", "cardamom", "saffron"],
            "difficulty": "Easy",
            "emoji": "🍶",
            "servings_per_liter": 6,
        },
        {
            "recipe_name": "Semiya Payasam",
            "description": "South Indian vermicelli pudding made with milk",
            "cook_time": "25 mins",
            "ingredients": ["milk", "vermicelli", "sugar", "cashews", "ghee"],
            "difficulty": "Easy",
            "emoji": "🍮",
            "servings_per_liter": 5,
        },
        {
            "recipe_name": "Masala Chai for All",
            "description": "Spiced tea — warm, comforting drink for large gatherings",
            "cook_time": "10 mins",
            "ingredients": ["milk", "tea leaves", "ginger", "cardamom", "sugar"],
            "difficulty": "Easy",
            "emoji": "☕",
            "servings_per_liter": 8,
        },
    ],
    "paneer": [
        {
            "recipe_name": "Paneer Butter Masala",
            "description": "Rich, creamy cottage cheese curry — crowd favorite",
            "cook_time": "35 mins",
            "ingredients": ["paneer", "butter", "cream", "tomatoes", "spices"],
            "difficulty": "Medium",
            "emoji": "🍛",
            "servings_per_kg": 8,
        },
        {
            "recipe_name": "Palak Paneer",
            "description": "Nutritious spinach and cottage cheese — iron-rich meal",
            "cook_time": "30 mins",
            "ingredients": ["paneer", "spinach", "onion", "garlic", "spices"],
            "difficulty": "Medium",
            "emoji": "🥬",
            "servings_per_kg": 7,
        },
    ],
    # Fruits
    "fruits": [
        {
            "recipe_name": "Fruit Chaat",
            "description": "Quick tangy fruit salad with chaat masala — no cooking needed",
            "cook_time": "5 mins",
            "ingredients": ["mixed fruits", "chaat masala", "lemon juice", "salt"],
            "difficulty": "Easy",
            "emoji": "🍱",
            "servings_per_kg": 8,
        },
        {
            "recipe_name": "Fruit Custard",
            "description": "Simple dessert mixing fruits with vanilla custard",
            "cook_time": "15 mins",
            "ingredients": ["fruits", "custard powder", "milk", "sugar"],
            "difficulty": "Easy",
            "emoji": "🍮",
            "servings_per_kg": 6,
        },
    ],
    # Cooked food / general
    "default": [
        {
            "recipe_name": "Community Meal Platter",
            "description": "Arrange donated food into a balanced communal meal platter",
            "cook_time": "10 mins",
            "ingredients": ["donated food items", "sides as available"],
            "difficulty": "Easy",
            "emoji": "🍱",
            "servings_per_kg": 5,
        },
        {
            "recipe_name": "Spiced Rice Porridge (Kanji)",
            "description": "Healing, easy-to-digest gruel — great for all ages",
            "cook_time": "20 mins",
            "ingredients": ["any grain", "water", "salt", "ginger"],
            "difficulty": "Easy",
            "emoji": "🥣",
            "servings_per_kg": 10,
        },
        {
            "recipe_name": "Sambar Rice",
            "description": "All-in-one South Indian lentil-vegetable rice — filling and nutritious",
            "cook_time": "30 mins",
            "ingredients": ["rice", "toor dal", "vegetables", "sambar powder", "tamarind"],
            "difficulty": "Medium",
            "emoji": "🍲",
            "servings_per_kg": 7,
        },
    ],
}

# ---------------------------------------------------------------------------
# Food keyword → recipe category mapper
# ---------------------------------------------------------------------------

FOOD_CATEGORY_MAP = {
    "rice":    ["rice", "basmati", "brown rice", "white rice"],
    "biryani": ["biryani", "pulao", "fried rice"],
    "dal":     ["dal", "lentil", "moong", "masoor", "chana", "rajma", "sambar"],
    "roti":    ["roti", "chapati", "paratha", "puri", "naan", "flatbread"],
    "bread":   ["bread", "toast", "bun", "sandwich"],
    "vegetables": ["vegetable", "sabzi", "veggie", "greens", "spinach", "potato",
                   "carrot", "beans", "peas", "cabbage", "broccoli", "salad"],
    "milk":    ["milk", "dairy", "curd", "yogurt", "lassi", "buttermilk"],
    "paneer":  ["paneer", "cottage cheese", "cheese"],
    "fruits":  ["fruit", "apple", "banana", "mango", "orange", "grape", "watermelon"],
}


def _detect_category(food_name: str) -> str:
    """Map a food name to a recipe category."""
    food_lower = food_name.lower()
    for category, keywords in FOOD_CATEGORY_MAP.items():
        if any(kw in food_lower for kw in keywords):
            return category
    return "default"


def _parse_quantity_value(quantity: str) -> float:
    """Extract numeric value from quantity string."""
    match = re.search(r"(\d+(\.\d+)?)", str(quantity))
    return float(match.group(1)) if match else 1.0


def _estimate_servings(recipe: dict, quantity: float) -> int:
    """Estimate servings for a recipe given a quantity."""
    per_kg = recipe.get("servings_per_kg") or recipe.get("servings_per_liter", 5)
    return max(1, int(math.floor(quantity * per_kg)))


# ---------------------------------------------------------------------------
# Gemini AI recipe generation
# ---------------------------------------------------------------------------

def _generate_with_gemini(food_name: str, quantity: str) -> list[dict] | None:
    """
    Use Gemini 1.5 Flash to generate 3 contextual Indian recipes.
    Returns None if API call fails or key not set.
    """
    if not GEMINI_API_KEY:
        return None

    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
You are a chef advisor for an Indian food donation NGO.

A donor has contributed: **{quantity}** of **{food_name}**.

Suggest exactly 3 practical, nutritious meal recipes that can be made from this donation for feeding people in need.
Focus on Indian recipes that are:
- Economical and scalable
- Easy to cook in bulk
- Nutritious and filling

Respond ONLY with a valid JSON array (no markdown, no explanation) with this exact structure:
[
  {{
    "recipe_name": "...",
    "description": "One sentence description",
    "servings": <estimated integer servings from {quantity} of {food_name}>,
    "cook_time": "X mins",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
    "difficulty": "Easy" | "Medium" | "Hard",
    "emoji": "<single relevant emoji>"
  }},
  ...
]
"""
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Clean markdown code blocks if present
        if text.startswith("```"):
            text = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()

        recipes = json.loads(text)
        if isinstance(recipes, list) and len(recipes) >= 1:
            return recipes[:3]
    except Exception as e:
        print(f"[RecipeEngine] Gemini failed: {e}")

    return None


# ---------------------------------------------------------------------------
# Main public function
# ---------------------------------------------------------------------------

def suggest_recipes(food_name: str, quantity: str) -> list[dict]:
    """
    Suggest 3 meal recipes for a donated food item.

    Parameters
    ----------
    food_name : str  – name of the donated food
    quantity  : str  – quantity string e.g. "20 kg", "50 plates"

    Returns
    -------
    list[dict] – 3 recipe dicts with name, description, servings, etc.
    """
    qty_value = _parse_quantity_value(quantity)

    # 1. Try Gemini AI first
    gemini_recipes = _generate_with_gemini(food_name, quantity)
    if gemini_recipes:
        return gemini_recipes

    # 2. Fallback: rule-based lookup
    category = _detect_category(food_name)
    recipes_pool = RECIPE_DATABASE.get(category, RECIPE_DATABASE["default"])

    # Use default recipes to fill up to 3
    if len(recipes_pool) < 3:
        recipes_pool = recipes_pool + RECIPE_DATABASE["default"]

    results = []
    for recipe in recipes_pool[:3]:
        servings = _estimate_servings(recipe, qty_value)
        results.append({
            "recipe_name": recipe["recipe_name"],
            "description": recipe["description"],
            "servings":    servings,
            "cook_time":   recipe["cook_time"],
            "ingredients": recipe["ingredients"],
            "difficulty":  recipe["difficulty"],
            "emoji":       recipe["emoji"],
        })

    return results
