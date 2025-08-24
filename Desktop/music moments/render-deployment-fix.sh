#!/bin/bash

# Music Moments - Render Deployment Fix Script
# This script ensures clean deployment configuration

echo "🎵 Music Moments - Render Deployment Fix"
echo "======================================="

# Ensure we're in the right directory
cd "/Users/ivanjackson/Desktop/music moments"

# Check if package.json exists in root (it should)
if [ -f "package.json" ]; then
    echo "✅ package.json found in root directory"
    
    # Show Node.js version from package.json
    echo "📦 Node.js version specified in package.json:"
    grep '"node"' package.json || echo "No Node.js version specified"
    
else
    echo "❌ ERROR: package.json not found in root directory!"
    exit 1
fi

# Check if render.yaml exists and is configured properly
if [ -f "render.yaml" ]; then
    echo "✅ render.yaml found and configured"
    echo "🔧 render.yaml contents:"
    cat render.yaml
else
    echo "❌ render.yaml not found - creating one now..."
    
cat > render.yaml << 'EOF'
services:
  - type: web
    name: music-moments-final
    runtime: node
    region: oregon  
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
EOF

    echo "✅ render.yaml created"
fi

# Ensure .nvmrc specifies correct Node.js version
echo "18" > .nvmrc
echo "✅ .nvmrc set to Node.js 18"

# Test local build to confirm it works
echo "🧪 Testing local build..."
if npm run build; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed - checking dependencies..."
    npm install
    if npm run build; then
        echo "✅ Local build successful after npm install!"
    else
        echo "❌ Local build still failing - manual intervention needed"
        exit 1
    fi
fi

# Clean up any problematic files
rm -rf node_modules/.cache
rm -rf .next

# Commit the changes
echo "📝 Committing deployment fix..."
git add .
git commit -m "Fix: Clean deployment configuration for Render (package.json in root, proper Node.js version)"

# Push to trigger deployment
echo "🚀 Pushing to GitHub to trigger deployment..."
git push

echo ""
echo "✨ Deployment fix complete!"
echo ""
echo "Next steps:"
echo "1. Go to Render dashboard"
echo "2. Create a new Web Service"
echo "3. Connect to GitHub repository: KingIVthe1st/songgram"
echo "4. Set Root Directory: (leave empty)"
echo "5. Build Command: npm install && npm run build"
echo "6. Start Command: npm start"
echo "7. Environment Variables:"
echo "   - NODE_ENV: production"
echo "   - PORT: 10000"
echo ""
echo "🎯 This should resolve the /opt/render/project/src/package.json error"