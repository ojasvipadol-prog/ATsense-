import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
EXPORT_DIR = DATA_DIR / "exports"

# Load .env from backend directory or project root
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")

# Ensure runtime directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
EXPORT_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "ATSense AI"
    VERSION: str = "1.0.0"
    TAGLINE: str = "Analyze. Optimize. Get Hired."
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "atsense-ai-super-secret-production-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_PATH: Path = DATA_DIR / "atsense.db"
    
    # Google Gemini API Key for LLM rewriting and recommendations
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Max file size 10MB
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024

settings = Settings()
