from fastapi import FastAPI
from pydantic import BaseModel
from database import users_collection
import bcrypt
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

JWT_SECRET = os.getenv("JWT_SECRET")


class User(BaseModel):
    name: str
    email: str
    password: str
    role: str


@app.get("/")
def home():
    return {"message": "SharePlate Backend Running"}


@app.post("/signup")
def signup(user: User):

    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        return {"message": "User already exists"}

    hashed_password = bcrypt.hashpw(
        user.password.encode('utf-8'),
        bcrypt.gensalt()
    )

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    })

    return {"message": "User created successfully"}


class LoginData(BaseModel):
    email: str
    password: str


@app.post("/login")
def login(data: LoginData):

    user = users_collection.find_one({"email": data.email})

    if not user:
        return {"message": "User not found"}

    password_correct = bcrypt.checkpw(
        data.password.encode('utf-8'),
        user["password"]
    )

    if not password_correct:
        return {"message": "Incorrect password"}

    token = jwt.encode(
        {
            "email": user["email"],
            "exp": datetime.utcnow() + timedelta(days=1)
        },
        JWT_SECRET,
        algorithm="HS256"
    )

    return {
        "message": "Login successful",
        "token": token
    }