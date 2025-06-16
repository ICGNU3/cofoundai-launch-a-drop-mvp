
#!/bin/bash

# NEPLUS Subgraph Deployment Script

set -e

echo "🚀 Deploying NEPLUS Subgraph..."

# Check if required environment variables are set
if [ -z "$SUBGRAPH_ACCESS_TOKEN" ]; then
    echo "❌ Error: SUBGRAPH_ACCESS_TOKEN environment variable is required"
    echo "   Get your access token from: https://thegraph.com/hosted-service/dashboard"
    exit 1
fi

# Authenticate with The Graph
echo "🔐 Authenticating with The Graph..."
npx graph auth --product hosted-service $SUBGRAPH_ACCESS_TOKEN

# Generate code
echo "📝 Generating AssemblyScript types..."
npx graph codegen

# Build the subgraph
echo "🔨 Building subgraph..."
npx graph build

# Deploy to hosted service
echo "📤 Deploying to The Graph hosted service..."
npx graph deploy --product hosted-service neplus/neplus-zora

echo "✅ Subgraph deployed successfully!"
echo "📊 View your subgraph at: https://thegraph.com/hosted-service/subgraph/neplus/neplus-zora"
