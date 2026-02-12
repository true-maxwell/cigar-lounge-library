#!/bin/bash

echo "🔥 Starting The Cigar Lounge Library..."
echo ""

# Check if .env files exist
if [ ! -f .env ]; then
    echo "⚠️  Creating frontend .env file..."
    cp .env.example .env
fi

if [ ! -f api/.env ]; then
    echo "⚠️  Creating backend .env file..."
    cp api/.env.example api/.env
fi

# Check if node_modules exist
if [ ! -d node_modules ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d api/node_modules ]; then
    echo "📦 Installing backend dependencies..."
    cd api && npm install && cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development servers..."
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers using trap to ensure both are killed on exit
trap 'kill $(jobs -p)' EXIT

# Start backend
(cd api && npm run dev) &

# Start frontend
npm run dev &

# Wait for both processes
wait
