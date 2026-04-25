#!/usr/bin/env bash

set -euo pipefail

echo "Checking backend health..."
curl -fsS http://localhost:8000/health | grep '"database":"connected"'

echo "Checking items endpoint..."
curl -fsS http://localhost:8000/api/items | grep 'SKU-1001'

echo "Checking warehouses endpoint..."
curl -fsS http://localhost:8000/api/warehouses | grep 'MUM-A1'

echo "Checking frontend..."
curl -fsS http://localhost:3000 | grep '<div id="root"></div>'

echo "Smoke tests passed."
