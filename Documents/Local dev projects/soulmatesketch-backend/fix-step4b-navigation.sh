#!/bin/bash

echo "🔧 FIXING STEP 4B NAVIGATION TO PAYMENT"
echo "======================================"
echo ""

# Define absolute paths
SOURCE_DIR="/Users/ivanjackson/Documents/Local dev projects/soulmatesketch-backend"
DEPLOY_DIR="/Users/ivanjackson/Documents/Local dev projects/soulsketchv2"

echo "📁 Source: $SOURCE_DIR"
echo "📁 Deploy: $DEPLOY_DIR"
echo ""

# Copy the fixed file
echo "📋 Copying fixed order.html with step4b navigation fix..."
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
echo "🎉 NAVIGATION FIX DEPLOYED!"
echo "=========================="
echo ""
echo "✅ Fixed Issues:"
echo "   • Step 4 'Next' button now labeled 'Generate Your Sketch'"
echo "   • Added explicit navigation to Step 5 (Payment)"
echo "   • Added debug logging for troubleshooting"
echo ""
echo "🌐 Live URLs (updating in ~2-3 minutes):"
echo "   • https://soulsketchv2-clean.onrender.com"
echo ""
echo "🧪 Test the flow:"
echo "   1. Complete Steps 1-4 of the quiz"
echo "   2. On Step 4 (Relationship Goals), click 'Generate Your Sketch'"
echo "   3. Should advance to Step 5 (Payment/Checkout)"
echo "   4. Check browser console for debug messages if issues persist"
echo ""
echo "✨ Ready for testing in 3 minutes! ✨"
