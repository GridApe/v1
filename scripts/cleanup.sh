#!/bin/bash

# Remove unused Docker resources
echo "🧹 Cleaning up Docker resources..."
docker system prune -f

# Remove old images
echo "🗑️ Removing old images..."
docker image prune -a -f

echo "✨ Cleanup complete!"

