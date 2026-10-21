# FinShield AI – Payment Fraud Detection & ANTI MONEY LANUDERING Platform Foundation

FinShield AI is an enterprise-grade Real-Time Payment Fraud Detection and Anti-Money Laundering (AML) monitoring platform. This repository contains the complete, production-grade foundation of the platform built with **FastAPI** (Python 3.12), **Next.js 15** (TypeScript, TailwindCSS, shadcn/ui), and **PostgreSQL**.

---

## Architecture & Directory Layout

### Backend Layered Architecture
The backend is structured into a strict layered architecture to ensure separation of concerns, scalability, and ease of unit testing:
*   `api/` – Route definitions, payload parsing, and dependency injections.
*   `services/` – Pure business logic, authorization utilities, and third-party wrappers.
*   `repositories/` – Database queries, filtering, CRUD abstraction.
*   `models/` – SQLAlchemy schema specifications.
*   `schemas/` – Pydantic models for data validation and schema documentation.
*   `core/` – Centralized settings (Pydantic-Settings), DB sessions, and security configurations.
*   `utils/` – General helper libraries.

### Frontend Feature-Based Architecture
The frontend is modularized by feature domain to align with team expansions:
*   `src/app/` – App router paths (login, register, dashboard).
*   `src/context/` – Context providers for global session states (auth, loading, roles).
*   `src/providers/` – React Query clients.
*   `src/features/` – Feature components and business hooks (e.g., `auth/components/LoginForm.tsx`).
*   `src/components/ui/` – Primitive, design-system-aligned UI components (shadcn/ui).
*   `src/lib/` – Shared utilities and API client wrapper.

---

## Security Implementation

1.  **JWT Authentication**: Session authentication is managed using cryptographically signed JSON Web Tokens (`HS256` algorithm). Credentials are validation-interceded dynamically in frontend client calls.
2.  **Role-Based Access Control (RBAC)**: Supports three core operational user roles:
    *   `admin` (System Administrator) – Can manage configurations, audits, and provision user roles.
    *   `analyst` (Fraud & AML Analyst) – Standard workspace permissions to review scored transactions and edit rules.
    *   `auditor` (Compliance Auditor) – Read-only clearances to generate operational compliance checks.
3.  **Password Security**: Raw passwords are never persisted. They are hashed using the industry-standard `bcrypt` algorithm with custom salt factors.

---

## Get Started

### System Prerequisites
Ensure you have the following installed:
*   [Python 3.12](https://www.python.org/downloads/)
*   [Node.js (v18 or newer)](https://nodejs.org/en)
*   [Docker & Docker Compose](https://www.docker.com/)

---

### Run using Docker Compose (Recommended)
You can launch the entire stack (PostgreSQL, FastAPI Backend, Next.js Frontend) using a single command:

```bash
# Clone and enter directory
cd finshield-ai

# Boot up container stack
docker compose up --build
```
*   **Frontend Client**: `http://localhost:3000`
*   **FastAPI Backend Server**: `http://localhost:8000`
*   **Interactive Swagger Documentation**: `http://localhost:8000/docs`

---

### Run Locally (Manual Development)

#### 1. Setup Database
Ensure PostgreSQL is running locally, and create a database named `finshield_db`.

#### 2. Start Backend API
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start dev server
uvicorn app.main:app --reload
```

#### 3. Start Frontend Client
```bash
cd frontend

# Install package dependencies
npm install

# Start next dev server
npm run dev
```
Navigate to `http://localhost:3000` to interact with the web interface.

---

## Database Tables (Auto-generated on launch)
*   **`users`**: Manages analyst details.
    *   `id`: Integer (Primary Key)
    *   `username`: String (Unique)
    *   `email`: String (Unique)
    *   `hashed_password`: String
    *   `full_name`: String
    *   `role`: Enum (`admin`, `analyst`, `auditor`)
    *   `is_active`: Boolean
    *   `created_at`/`updated_at`: DateTime
