#!/bin/bash
set -e

# Build the Docker image
echo "🏗️ Building Docker image..."
docker compose build

# Stop the existing container
echo "🛑 Stopping existing containers..."
docker compose down

# Start the new container
echo "🚀 Starting new containers..."
docker compose up -d

# Watch the logs
echo "📝 Watching logs..."
docker compose logs -f

