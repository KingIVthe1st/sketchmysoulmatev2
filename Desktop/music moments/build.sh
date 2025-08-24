#!/bin/bash
set -e

echo "Current working directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Ensure we're in the correct directory with package.json
if [ ! -f "package.json" ]; then
    echo "package.json not found in current directory, searching..."
    find . -name "package.json" -type f
    if [ -f "./Desktop/music moments/package.json" ]; then
        cd "./Desktop/music moments"
        echo "Changed to: $(pwd)"
    elif [ -f "music moments/package.json" ]; then
        cd "music moments"
        echo "Changed to: $(pwd)"
    else
        echo "ERROR: Cannot find package.json"
        exit 1
    fi
fi

echo "Installing dependencies..."
npm install

echo "Running build..."
npm run build

echo "Build completed successfully!"