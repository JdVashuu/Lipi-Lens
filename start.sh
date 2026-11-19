#!/usr/bin/env bash
# LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) - Automated Startup Script
set -e

echo "=========================================================="
echo "  LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X)"
echo "  Edge-Native Spatial AR & Kannada Script Intelligence"
echo "=========================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Start Python FastAPI Backend
echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..."
cd "$ROOT_DIR/backend"
if [ ! -d ".venv" ]; then
  uv venv
  uv pip install -r requirements.txt
fi
uv run uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# 2. Start Vite Frontend
echo "[2/2] Starting Vite Frontend on http://localhost:5173..."
cd "$ROOT_DIR/frontend"
if [ ! -d "node_modules" ]; then
  bun install || npm install
fi
bun run dev &
FRONTEND_PID=$!

echo ""
echo "🚀 LipiLens-X is LIVE!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://127.0.0.1:8000 (API Docs: http://127.0.0.1:8000/docs)"
echo ""
echo "Press CTRL+C to terminate both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
