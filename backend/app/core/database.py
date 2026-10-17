from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# Adjust engine based on whether it is SQLite
is_sqlite = settings.SQLALCHEMY_DATABASE_URI.startswith("sqlite")

connect_args = {"check_same_thread": False} if is_sqlite else {}
pool_pre_ping = False if is_sqlite else True

# Create database engine
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    connect_args=connect_args,
    pool_pre_ping=pool_pre_ping, 
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for models
Base = declarative_base()
