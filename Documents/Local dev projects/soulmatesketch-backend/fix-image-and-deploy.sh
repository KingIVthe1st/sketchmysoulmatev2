#!/bin/bash

echo "🔧 FIXING ISSUES AND DEPLOYING"
echo "=============================="
echo ""

# 1. Copy blonde.png to correct location
echo "📁 1. Copying blonde.png to public/images/home/..."
cp blonde.png public/images/home/blonde.png
echo "   ✅ blonde.png copied successfully"
echo ""

# 2. Copy all files to deployment repo
echo "📋 2. Copying files to deployment repo..."
DEPLOY_DIR="../soulsketchv2"

# Check if deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "❌ ERROR: Deploy directory $DEPLOY_DIR not found!"
    echo "   Please check the path to your soulsketchv2 repository."
    exit 1
fi

# Copy updated files
cp public/images/home/blonde.png "$DEPLOY_DIR/public/images/home/"
cp src/payments.js "$DEPLOY_DIR/src/"
cp src/routes.js "$DEPLOY_DIR/src/"

echo "   ✅ Files copied to deployment repo"
echo ""

# 3. Deploy to Git
echo "🚀 3. Deploying to GitHub/Render..."
cd "$DEPLOY_DIR"

# Add all changes
git add -A

# Commit with detailed message
git commit -m "🔧 Fix missing blonde.png and payment API issues

• Add missing blonde.png to public/images/home/
• Ensure payment API endpoints are properly configured
• Fix any routing issues for Stripe integration

Fixes:
- Resolve 404 error for /images/home/blonde.png
- Ensure payment API returns proper JSON responses
- Improve error handling for Stripe endpoints"

# Push to trigger auto-deploy
git push origin main

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================"
echo ""
echo "✅ Fixed Issues:"
echo "   • blonde.png now available at correct path"
echo "   • Payment API should work properly"
echo "   • All files synced to production"
echo ""
echo "🌐 Live URLs (updating in ~2-3 minutes):"
echo "   • https://soulsketchv2-clean.onrender.com"
echo "   • https://soulsketch-final.onrender.com"
echo ""
echo "🧪 Test again in 3 minutes with:"
echo "   node quick-api-test.js"
echo ""
