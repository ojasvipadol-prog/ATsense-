import re
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, field_validator
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email address format.")
        return clean

class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email address format.")
        return clean

class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email address format.")
        return clean

@router.post("/register")
def register(req: RegisterRequest):
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")
        
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", (req.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="An account with this email already exists.")
            
        hashed = hash_password(req.password)
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (req.name.strip(), req.email, hashed)
        )
        user_id = cursor.lastrowid
        token = create_access_token({"sub": str(user_id), "email": req.email, "name": req.name.strip()})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": req.name.strip(),
                "email": req.email
            }
        }

@router.post("/login")
def login(req: LoginRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, password_hash FROM users WHERE email = ?", (req.email,))
        row = cursor.fetchone()
        
        if not row or not verify_password(req.password, row["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
            
        token = create_access_token({"sub": str(row["id"]), "email": row["email"], "name": row["name"]})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"]
            }
        }

@router.get("/me")
def get_current_user_profile(user: dict = Depends(get_current_user)):
    user_id = int(user["sub"])
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found.")
        return {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
            "created_at": row["created_at"]
        }

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email FROM users WHERE email = ?", (req.email,))
        row = cursor.fetchone()
        if not row:
            return {"message": "If an account exists with this email, password reset instructions have been dispatched."}
        return {"message": f"Password reset instructions have been generated for {req.email}."}
