import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    # Project settings
    PROJECT_NAME: str = "Pro Garden CRM"
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/pro_garden_crm.db")
    
    # Clean up URL
    if DATABASE_URL:
        DATABASE_URL = DATABASE_URL.strip().strip('"').strip("'")
        
        # Remove common prefixes from copy-pasting
        if DATABASE_URL.startswith("psql "):
            DATABASE_URL = DATABASE_URL.replace("psql ", "", 1)
            DATABASE_URL = DATABASE_URL.strip().strip("'") # Clean up again after removing psql
            
        # Handle Render/Neon postgres:// compatibility
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
            
    # Log the URL (masked) for debugging
    safe_url = DATABASE_URL
    if "@" in safe_url:
        # Mask password: postgresql://user:pass@host... -> postgresql://user:****@host...
        try:
            prefix = safe_url.split("@")[0]
            suffix = safe_url.split("@")[1]
            if ":" in prefix:
                user_part = prefix.split(":")[0] + ":" + prefix.split(":")[1].split("//")[1]
                # Reconstruct roughly
                safe_url = f"{user_part}:****@{suffix}"
        except:
            safe_url = "Could not mask URL safely"
            
    print(f"DEBUG: Using Database URL: {safe_url}")

    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-keep-it-secret")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

# Create settings instance
settings = Settings()
