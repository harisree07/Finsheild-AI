from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user import UserRole


# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.ANALYST


# Properties to receive on user creation
class UserCreate(UserBase):
    password: str


# Properties to receive on user update
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


# Properties to return to client
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    # In Pydantic v2, we use model_config instead of class Config
    model_config = ConfigDict(from_attributes=True)


# Schema for User Login
class UserLogin(BaseModel):
    username_or_email: str
    password: str


# Token schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Token data contents
class TokenPayload(BaseModel):
    sub: Optional[str] = None  # Contains the username or user_id
    role: Optional[str] = None
