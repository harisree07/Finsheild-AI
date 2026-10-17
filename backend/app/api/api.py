from fastapi import APIRouter
from app.api.endpoints import auth

api_router = APIRouter()

# Register routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
