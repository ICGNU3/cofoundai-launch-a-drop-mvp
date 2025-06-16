
#!/bin/bash

echo "🔧 Installing Foundry dependencies..."
cd packages/contracts
make install

echo "🎨 Formatting code..."
make fmt

echo "🧪 Running tests..."
make test

echo "🔨 Building contracts..."
make build

echo "✅ All tests and builds completed!"
