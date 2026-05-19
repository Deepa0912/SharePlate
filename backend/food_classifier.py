"""
food_classifier.py
==================
AI-powered food image classification for SharePlate.

Uses MobileNetV2 pretrained on ImageNet via keras.applications.
  - Model weights auto-download on first run (~14 MB)
  - No custom training required
  - Filters predictions to a curated food-label whitelist
  - Returns top predicted food name + confidence percentage

Production notes:
  - Model is loaded once at module level (singleton) for fast API response
  - Compatible with TensorFlow >= 2.16 and Keras 3.x
  - Supports JPEG, PNG, WEBP, BMP image formats via PIL
"""

import io
import logging
from typing import Optional

import numpy as np
from PIL import Image, UnidentifiedImageError

# ---------------------------------------------------------------------------
# TF / Keras — support both legacy tf.keras and standalone keras 3.x
# ---------------------------------------------------------------------------
try:
    # TF 2.16+ ships with standalone Keras 3 as the default backend
    import keras
    from keras.applications import MobileNetV2
    from keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
    import tensorflow as tf
    _BACKEND = "keras3"
except ImportError:
    # Fallback: older TF with bundled tf.keras
    import tensorflow as tf
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.applications.mobilenet_v2 import (
        preprocess_input,
        decode_predictions,
    )
    _BACKEND = "tf_keras"

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Model singleton — loaded once when the module is first imported
# ---------------------------------------------------------------------------

logger.info("[food_classifier] Loading MobileNetV2 weights (backend=%s)…", _BACKEND)

_MODEL: object = MobileNetV2(weights="imagenet", include_top=True)

# Mark non-trainable for inference (API differs between Keras 3 and tf.keras)
try:
    _MODEL.trainable = False
except Exception:
    pass  # some Keras 3 builds raise on setting trainable after build

logger.info("[food_classifier] Model ready.")


# ---------------------------------------------------------------------------
# Curated food-related ImageNet synset labels
# Maps ImageNet class name  →  friendly display name
# ---------------------------------------------------------------------------

FOOD_LABEL_MAP: dict = {
    # Fruits & vegetables
    "banana":            "Banana",
    "lemon":             "Lemon",
    "orange":            "Orange",
    "strawberry":        "Strawberry",
    "pineapple":         "Pineapple",
    "fig":               "Fig",
    "pomegranate":       "Pomegranate",
    "jackfruit":         "Jackfruit",
    "broccoli":          "Broccoli",
    "cauliflower":       "Cauliflower",
    "mushroom":          "Mushroom",
    "bell_pepper":       "Bell Pepper",
    "cucumber":          "Cucumber",
    "artichoke":         "Artichoke",
    "cardoon":           "Cardoon",
    "head_cabbage":      "Cabbage",
    "spaghetti_squash":  "Squash",
    "zucchini":          "Zucchini",
    "acorn_squash":      "Squash",
    "butternut_squash":  "Butternut Squash",

    # Cooked / prepared foods
    "pizza":             "Pizza",
    "hamburger":         "Hamburger / Burger",
    "hotdog":            "Hotdog",
    "hot_dog":           "Hotdog",
    "cheeseburger":      "Cheeseburger",
    "burrito":           "Burrito",
    "taco":              "Taco",
    "pretzel":           "Pretzel",
    "bagel":             "Bagel",
    "French_loaf":       "Bread / Loaf",
    "baguette":          "Baguette / Bread",
    "bread":             "Bread",
    "croissant":         "Croissant",
    "mashed_potato":     "Mashed Potato",
    "French_fries":      "French Fries",
    "potato_skin":       "Potato Skin",
    "guacamole":         "Guacamole",
    "consomme":          "Soup / Consomme",
    "chili":             "Chili",
    "potpie":            "Pot Pie",
    "carbonara":         "Pasta / Carbonara",
    "spaghetti":         "Spaghetti / Pasta",
    "lasagna":           "Lasagna",
    "ravioli":           "Ravioli",
    "macaroni":          "Macaroni",
    "omelette":          "Omelette / Egg",
    "egg":               "Egg / Cooked Egg",
    "fried_egg":         "Fried Egg",
    "deviled_egg":       "Deviled Egg",
    "boiled_egg":        "Boiled Egg",
    "rice":              "Rice",
    "biryani":           "Biryani / Rice",
    "chicken":           "Chicken",
    "roast_beef":        "Roast Beef",
    "meat_loaf":         "Meat / Meatloaf",
    "pork":              "Pork",
    "fish":              "Fish",
    "salmon":            "Salmon",
    "tuna":              "Tuna",
    "shrimp":            "Shrimp / Prawns",
    "lobster":           "Lobster",
    "crab":              "Crab",

    # Dairy
    "ice_cream":         "Ice Cream",
    "ice_lolly":         "Ice Lolly",
    "chocolate_ice_cream": "Chocolate Ice Cream",
    "cheese":            "Cheese",
    "butter":            "Butter",
    "milk_can":          "Milk / Dairy",
    "pudding":           "Pudding",

    # Baked goods & sweets
    "chocolate_cake":    "Chocolate Cake",
    "birthday_cake":     "Birthday Cake",
    "cream_cake":        "Cream Cake",
    "cupcake":           "Cupcake",
    "doughnut":          "Doughnut",
    "trifle":            "Trifle / Dessert",
    "waffle":            "Waffle",
    "pancake":           "Pancake",
    "crepe":             "Crepe",
    "muffin":            "Muffin",
    "cookie":            "Cookie / Biscuit",
    "chocolate_truffle": "Chocolate",

    # Beverages & snacks
    "espresso":          "Coffee / Espresso",
    "cup":               "Tea / Beverage",
    "bowl":              "Food Bowl",
    "plate":             "Plated Food",
    "dining_table":      "Meal / Food Spread",
    "pita":              "Pita / Flatbread",
    "noodles":           "Noodles",
    "ramen":             "Ramen / Noodles",
    "sushi":             "Sushi",
    "spring_roll":       "Spring Roll",
    "samosa":            "Samosa / Snack",
    "soup_bowl":         "Soup",
    "salad":             "Salad",
}


def _match_food_label(imagenet_class: str) -> Optional[str]:
    """
    Map an ImageNet class name to a human-readable food label.
    Returns None if the class is not food-related.
    """
    label_lower = imagenet_class.lower().replace("-", "_")
    for key, display_name in FOOD_LABEL_MAP.items():
        if key in label_lower or label_lower in key:
            return display_name
    return None


# ---------------------------------------------------------------------------
# Image preprocessing helpers
# ---------------------------------------------------------------------------

def _load_and_preprocess(image_bytes: bytes) -> np.ndarray:
    """
    Convert raw image bytes → MobileNetV2-ready numpy array.

    Steps:
      1. Open image with PIL (handles JPEG, PNG, WEBP, BMP, etc.)
      2. Convert to RGB (drops alpha channel if present)
      3. Resize to 224×224 (MobileNetV2 input size)
      4. Apply MobileNetV2 preprocessing (scale to [-1, 1])
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise ValueError(f"Cannot decode image: {exc}") from exc

    img = img.resize((224, 224), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)         # shape: (224, 224, 3)
    arr = np.expand_dims(arr, axis=0)              # shape: (1, 224, 224, 3)
    arr = preprocess_input(arr)                    # scale to [-1, 1]
    return arr


# ---------------------------------------------------------------------------
# Main classification function
# ---------------------------------------------------------------------------

def classify_food(image_bytes: bytes, top_k: int = 5) -> dict:
    """
    Run MobileNetV2 food classification on raw image bytes.

    Parameters
    ----------
    image_bytes : bytes   — raw image file content
    top_k       : int     — number of top ImageNet predictions to inspect

    Returns
    -------
    dict with keys:
        food_name        : str   — friendly food name (e.g. "Pizza")
        confidence       : float — confidence 0–100 (e.g. 94.3)
        label_raw        : str   — raw ImageNet class (e.g. "pizza")
        top_predictions  : list[dict] — all food matches found in top_k
        is_food          : bool  — False if no food label found in top_k
    """
    # 1. Preprocess image
    arr = _load_and_preprocess(image_bytes)

    # 2. Run inference — verbose=0 suppresses progress bar
    preds = _MODEL.predict(arr, verbose=0)         # shape: (1, 1000)

    # 3. Decode top-k ImageNet predictions
    #    Returns: list of (synset_id, class_name, confidence_float)
    decoded = decode_predictions(preds, top=top_k)[0]

    # 4. Filter for food-related labels
    food_matches = []
    for _synset, class_name, confidence in decoded:
        friendly = _match_food_label(class_name)
        if friendly:
            food_matches.append({
                "food_name":  friendly,
                "label_raw":  class_name,
                "confidence": round(float(confidence) * 100, 2),
            })

    # 5. Handle no-food case — return raw top-1 with is_food=False
    if not food_matches:
        top_class = decoded[0][1]
        top_conf  = round(float(decoded[0][2]) * 100, 2)
        return {
            "food_name":        top_class.replace("_", " ").title(),
            "confidence":       top_conf,
            "label_raw":        top_class,
            "top_predictions":  [],
            "is_food":          False,
        }

    best = food_matches[0]
    return {
        "food_name":       best["food_name"],
        "confidence":      best["confidence"],
        "label_raw":       best["label_raw"],
        "top_predictions": food_matches,
        "is_food":         True,
    }
