from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.hash import pbkdf2_sha256
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from .config import settings

# Configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# Password hashing
# Using PBKDF2 with SHA-256 for better compatibility
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Token models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    is_admin: bool = False

class UserInDB(BaseModel):
    username: str
    hashed_password: str
    is_admin: bool = False

# Password utilities
def hash_password(password: str) -> str:
    # Using pbkdf2_sha256 directly for more control and better error handling
    try:
        # Using 29000 iterations (NIST recommends at least 10,000)
        return pbkdf2_sha256.using(rounds=29000).hash(password)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error hashing password: {str(e)}"
        )

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pbkdf2_sha256.verify(plain_password, hashed_password)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying password: {str(e)}"
        )

# JWT functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, is_admin=payload.get("is_admin", False))
    except JWTError:
        raise credentials_exception
    return token_data

async def get_current_active_admin(current_user: TokenData = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=400, detail="Insufficient permissions")
    return current_user
