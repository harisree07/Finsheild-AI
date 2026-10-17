from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.repositories.user import UserRepository
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse
from app.services.auth import get_password_hash, verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    """Register a new user inside the system."""
    user_repo = UserRepository(db)
    
    # Check if username or email already exists
    if user_repo.get_by_email(user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists in the system.",
        )
    if user_repo.get_by_username(user_in.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username already exists in the system.",
        )

    hashed_pw = get_password_hash(user_in.password)
    user = user_repo.create(user_in, hashed_password=hashed_pw)
    return user


@router.post("/login", response_model=Token)
def login_json(credentials: UserLogin, db: Session = Depends(deps.get_db)):
    """Standard JSON API login return JWT token."""
    user_repo = UserRepository(db)
    
    # Check if the identifier is email or username
    if "@" in credentials.username_or_email:
        user = user_repo.get_by_email(credentials.username_or_email)
    else:
        user = user_repo.get_by_username(credentials.username_or_email)
        
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user account has been disabled.",
        )

    access_token = create_access_token(subject=user.username, role=user.role.value)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/login-oauth", response_model=Token)
def login_oauth(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    """OAuth2 password flow login (specifically for Swagger UI integration)."""
    user_repo = UserRepository(db)
    user = user_repo.get_by_username(form_data.username)
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user account has been disabled.",
        )

    access_token = create_access_token(subject=user.username, role=user.role.value)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(deps.get_current_user)):
    """Retrieve details of currently logged-in user."""
    return current_user
