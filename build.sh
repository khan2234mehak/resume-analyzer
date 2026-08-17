#!/usr/bin/env bash
set -e

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Copying frontend build into backend/frontend_dist..."
rm -rf backend/frontend_dist
cp -r frontend/dist backend/frontend_dist

echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "Build complete."
