#!/bin/sh

set -eu

echo "Waiting for database..."
until python -c "from app.database import engine; from sqlalchemy import text; conn = engine.connect(); conn.execute(text('SELECT 1')); conn.close()" >/dev/null 2>&1; do
  sleep 2
done

echo "Checking migration state..."
if python -c "from app.database import engine; from sqlalchemy import inspect; inspector = inspect(engine); tables = set(inspector.get_table_names()); raise SystemExit(0 if 'warehouses' in tables and 'alembic_version' not in tables else 1)" >/dev/null 2>&1; then
  echo "Existing schema detected without Alembic history. Stamping current schema..."
  PYTHONPATH=/app alembic stamp head
fi

echo "Running database migrations..."
PYTHONPATH=/app alembic upgrade head

echo "Starting API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
