import os
from typing import Any, Dict, Optional
from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FinShield AI"

    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "prod_grade_super_secret_key_change_me_in_production_123456789")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database Configuration
    USE_SQLITE: bool = True
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "finshield_db"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], values: Any) -> Any:
        if isinstance(v, str) and v:
            return v
        
        data = values.data if hasattr(values, "data") else values
        use_sqlite = data.get("USE_SQLITE", True)
        if use_sqlite:
            return "sqlite:///./finshield.db"
        
        server = data.get("POSTGRES_SERVER")
        port = data.get("POSTGRES_PORT")
        user = data.get("POSTGRES_USER")
        password = data.get("POSTGRES_PASSWORD")
        db = data.get("POSTGRES_DB")

        return f"postgresql://{user}:{password}@{server}:{port}/{db}"

    # CORS Settings
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")


settings = Settings()
