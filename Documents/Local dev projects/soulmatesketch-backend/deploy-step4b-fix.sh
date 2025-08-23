#!/bin/bash

echo "🔧 FIXING STEP 4B NAVIGATION - UNIVERSAL DEPLOY"
echo "=============================================="
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
git commit -m "🔧 Fix Step 4B navigation to payment step

• Change Step 4 Next button to 'Generate Your Sketch'
• Add explicit onclick handler to force navigation to step 5
• Add debugging console.log to track navigation issues
• Ensure users can proceed from final quiz step to payment

Fixes:
- Step 4 (Relationship Goals) now properly advances to Step 5 (Payment)
- Button clearly labeled 'Generate Your Sketch' for clarity
- Debug logging to identify any remaining navigation issues"

# Push to trigger auto-deploy
git push origin main

echo ""
echo "🎉 STEP 4B NAVIGATION FIX DEPLOYED!"
echo "=================================="
echo ""
echo "✅ Fixed Issues:"
echo "   • Step 4 'Next' button now labeled 'Generate Your Sketch'"
echo "   • Added explicit navigation to Step 5 (Payment)"
echo "   • Added debug logging for troubleshooting"
echo ""
echo "🌐 Live URL (updating in ~2-3 minutes):"
echo "   • https://soulsketchv2-clean.onrender.com"
echo ""
echo "🧪 Test Steps:"
echo "   1. Go to: https://soulsketchv2-clean.onrender.com/order.html"
echo "   2. Complete Steps 1-4 of the quiz"
echo "   3. On Step 4 (Relationship Goals), click 'Generate Your Sketch'"
echo "   4. Should advance to Step 5 (Payment/Checkout)"
echo "   5. Open browser console (F12) to see debug messages"
echo ""
echo "✨ Ready for testing in 3 minutes! ✨"
