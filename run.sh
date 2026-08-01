#!/bin/bash

# Ensure we're in the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "======================================"
echo "    Starting CodeAtlas Servers...     "
echo "======================================"

# Cleanup function to kill child processes when the script exits
cleanup() {
    echo -e "\nStopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM to run cleanup
trap cleanup SIGINT SIGTERM

# 1. Start Local Redis Server
echo "Starting Local Redis Server..."
if [ -f "$PROJECT_ROOT/local_redis/redis-stable/src/redis-server" ]; then
    "$PROJECT_ROOT/local_redis/redis-stable/src/redis-server" --daemonize yes
    echo "Redis server started."
else
    echo "Warning: Local redis-server not found at local_redis/redis-stable/src/redis-server."
    echo "Please ensure Redis is built or installed globally."
fi

# 2. Start Django Backend
echo "Starting Django Backend (http://127.0.0.1:8000)..."
cd "$PROJECT_ROOT/backend"
if [ -d "venv" ]; then
    source venv/bin/activate
    python manage.py runserver &
else
    echo "Error: Backend virtual environment 'venv' not found."
    echo "Please set up the backend according to the README."
    exit 1
fi

# 2. Start Celery Worker
echo "Starting Celery Worker..."
cd "$PROJECT_ROOT/backend"
if [ -d "venv" ]; then
    source venv/bin/activate
    celery -A config worker --loglevel=info &
fi

# 3. Start React Frontend
echo "Starting React Frontend (http://localhost:5173)..."
cd "$PROJECT_ROOT/frontend"
npm run dev &

# Wait for all background jobs (keeps the script running)
wait
