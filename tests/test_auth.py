import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.api.deps import get_db
from app.core.database import Base

# Setup SQLite test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override the dependency to use the SQLite test db session
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    # Create the database schema
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the schema after the test runs
    Base.metadata.drop_all(bind=engine)


def test_register_user_success():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "testanalyst@finshield.ai",
            "username": "test_analyst",
            "full_name": "Test Analyst",
            "password": "securepassword123",
            "role": "analyst",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testanalyst@finshield.ai"
    assert data["username"] == "test_analyst"
    assert data["role"] == "analyst"
    assert "hashed_password" not in data


def test_register_duplicate_username():
    user_data = {
        "email": "testanalyst@finshield.ai",
        "username": "test_analyst",
        "full_name": "Test Analyst",
        "password": "securepassword123",
        "role": "analyst",
    }
    # Register first time
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201

    # Register second time with duplicate username
    response2 = client.post(
        "/api/v1/auth/register",
        json={
            "email": "anotheremail@finshield.ai",
            "username": "test_analyst",
            "full_name": "Another Name",
            "password": "securepassword123",
            "role": "analyst",
        },
    )
    assert response2.status_code == 400
    assert "already exists" in response2.json()["detail"]


def test_login_and_get_me_success():
    user_data = {
        "email": "testanalyst@finshield.ai",
        "username": "test_analyst",
        "full_name": "Test Analyst",
        "password": "securepassword123",
        "role": "analyst",
    }
    # Register user
    client.post("/api/v1/auth/register", json=user_data)

    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "username_or_email": "test_analyst",
            "password": "securepassword123",
        },
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"

    # Access secure /me endpoint using token
    token = login_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    me_response = client.get("/api/v1/auth/me", headers=headers)
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["username"] == "test_analyst"
    assert me_data["email"] == "testanalyst@finshield.ai"
