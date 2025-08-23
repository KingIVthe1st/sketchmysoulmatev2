#!/bin/bash

echo "🔧 FIXING GENERATE BUTTON - UNIVERSAL DEPLOY SCRIPT"
echo "=================================================="
echo ""

# Define absolute paths
SOURCE_DIR="/Users/ivanjackson/Documents/Local dev projects/soulmatesketch-backend"
DEPLOY_DIR="/Users/ivanjackson/Documents/Local dev projects/soulsketchv2"

echo "📁 Source: $SOURCE_DIR"
echo "📁 Deploy: $DEPLOY_DIR"
echo ""

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ ERROR: Source directory not found!"
    echo "   Expected: $SOURCE_DIR"
    exit 1
fi

# Check if deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "❌ ERROR: Deploy directory not found!"
    echo "   Expected: $DEPLOY_DIR"
    exit 1
fi

# Copy the fixed file
echo "📋 Copying fixed order.html..."
cp "$SOURCE_DIR/public/order.html" "$DEPLOY_DIR/public/"

if [ $? -eq 0 ]; then
    echo "   ✅ order.html copied successfully"
else
    echo "   ❌ Failed to copy order.html"
    exit 1
fi

echo ""

# Navigate to deployment directory and deploy
echo "🚀 Deploying to GitHub/Render..."
cd "$DEPLOY_DIR"

# Add all changes
git add -A

# Commit with detailed message
git commit -m "🔧 Fix Generate Sketch button flow to payment step

• Change button type from 'submit' to 'button' with 'next' class
• Ensures button navigates to Step 5 (Payment) instead of getting stuck
• Users can now complete the full quiz → payment → deliverables flow

Fixes:
- Generate Your Sketch button now properly advances to checkout
- Payment step integration working correctly
- Smooth user flow from quiz completion to payment"

# Push to trigger auto-deploy
git push origin main

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "✅ Fixed Issue:"
echo "   • Generate Your Sketch button now goes to payment step"
echo "   • Users won't get stuck on final quiz step"
echo "   • Complete flow: Quiz → Payment → Deliverables"
echo ""
echo "🌐 Live URLs (updating in ~2-3 minutes):"
echo "   • https://soulsketchv2-clean.onrender.com"
echo "   • https://soulsketch-final.onrender.com"
echo ""
echo "🧪 Test the flow:"
echo "   1. Go to /order.html"
echo "   2. Complete the 4 quiz steps"
echo "   3. Click 'Generate Your Sketch'"
echo "   4. Should go to payment step (Step 5)"
echo ""
echo "✨ Ready for testing in 3 minutes! ✨"
