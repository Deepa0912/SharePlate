from bson import ObjectId
from datetime import datetime
from typing import Any


def str_to_objectid(id_str: str) -> ObjectId:
    """Convert a string to a MongoDB ObjectId, raising ValueError if invalid."""
    if not ObjectId.is_valid(id_str):
        raise ValueError(f"'{id_str}' is not a valid ObjectId.")
    return ObjectId(id_str)


def serialize_doc(doc: dict) -> dict:
    """
    Recursively convert a MongoDB document to a JSON-serialisable dict.
    - ObjectId  → str
    - datetime  → ISO-8601 string
    """
    if doc is None:
        return {}
    result = {}
    for key, value in doc.items():
        if key == "_id":
            result["id"] = str(value)
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat().replace("+00:00", "Z")
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        elif isinstance(value, list):
            result[key] = [
                serialize_doc(v) if isinstance(v, dict) else str(v) if isinstance(v, ObjectId) else v
                for v in value
            ]
        else:
            result[key] = value
    return result


def paginate_params(skip: int = 0, limit: int = 20) -> dict:
    """Return pagination params capped at 100 items per page."""
    return {"skip": max(skip, 0), "limit": min(limit, 100)}
