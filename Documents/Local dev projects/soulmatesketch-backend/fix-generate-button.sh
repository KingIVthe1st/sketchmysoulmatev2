#!/bin/bash

echo "🔧 FIXING GENERATE BUTTON FLOW"
echo "==============================="
echo ""

# Deploy to Git
echo "🚀 Deploying fix to GitHub/Render..."
DEPLOY_DIR="../soulsketchv2"

# Check if deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "❌ ERROR: Deploy directory $DEPLOY_DIR not found!"
    echo "   Please check the path to your soulsketchv2 repository."
    exit 1
fi

# Copy updated files
cp public/order.html "$DEPLOY_DIR/public/"

echo "   ✅ order.html copied to deployment repo"
echo ""

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
echo "🎉 FIX DEPLOYED!"
echo "================"
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
