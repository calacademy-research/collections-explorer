#!/bin/sh

echo "Starting Convex in self-hosted mode..."

# Set up environment for self-hosted Convex
export CONVEX_DEPLOYMENT=""
export CONVEX_TEAM="self-hosted"
export CONVEX_PROJECT="cas-collections-explorer"

# Start the actual Convex self-hosted server
echo "Starting Convex self-hosted server..."
npx convex dev --self-hosted --port 8000 --host 0.0.0.0 