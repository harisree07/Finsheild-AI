FROM python:3.12-slim

WORKDIR /workspace

# Install system compilation dependencies for PostgreSQL client and bcrypt
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Ensure app package is importable by setting PYTHONPATH
ENV PYTHONPATH=/workspace

EXPOSE 8000

# Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
