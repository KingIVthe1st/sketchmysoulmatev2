#!/bin/bash

echo "🔧 FIXING STEP 1 NEXT BUTTON"
echo "============================"
echo ""

# Define absolute paths
SOURCE_DIR="/Users/ivanjackson/Documents/Local dev projects/soulmatesketch-backend"
DEPLOY_DIR="/Users/ivanjackson/Documents/Local dev projects/soulsketchv2"

echo "📁 Source: $SOURCE_DIR"
echo "📁 Deploy: $DEPLOY_DIR"
echo ""

# Check directories exist
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ ERROR: Source directory not found!"
    exit 1
fi

if [ ! -d "$DEPLOY_DIR" ]; then
    echo "❌ ERROR: Deploy directory not found!"
    exit 1
fi

# Copy the fixed file
echo "📋 Copying fixed order.html with Step 1 button fixes..."
cp "$SOURCE_DIR/public/order.html" "$DEPLOY_DIR/public/"

if [ $? -eq 0 ]; then
    echo "   ✅ order.html copied successfully"
else
    echo "   ❌ Failed to copy order.html"
    exit 1
fi

echo ""

# Deploy to GitHub/Render
echo "🚀 Deploying Step 1 Button Fixes..."
cd "$DEPLOY_DIR"

git add -A

git commit -m "🔧 Fix Step 1 Next button positioning and functionality

✅ BUTTON POSITIONING:
• Move Next button from left to right side
• Remove extra div wrapper causing layout issues
• Add text-align: right for proper positioning

✅ DEBUGGING & VALIDATION:
• Add comprehensive logging for button clicks
• Debug validation process for step 1
• Track state updates and email validation
• Console logs with emoji indicators for easy debugging

✅ FUNCTIONALITY:
• Ensure email validation works properly
• Fix button click event handling
• Verify state management for form inputs

Fixes Step 1 progression issue where Next button wasn't clickable"

git push origin main

echo ""
echo "🎉 STEP 1 BUTTON FIXES DEPLOYED!"
echo "=============================="
echo ""
echo "✅ Fixed Issues:"
echo "   • Next button moved to right side"
echo "   • Button positioning and layout corrected"
echo "   • Added debugging for button clicks and validation"
echo "   • Enhanced email validation logging"
echo ""
echo "🌐 Live URL (updating in ~3-4 minutes):"
echo "   • https://soulsketchv2-clean.onrender.com"
echo ""
echo "🧪 TEST SEQUENCE:"
echo "   1. Go to: https://soulsketchv2-clean.onrender.com/order.html"
echo "   2. Fill in email field (required): ivanleejackson@gmail.com"
echo "   3. Click Next button (should be on right side)"
echo "   4. Should advance to Step 2"
echo "   5. Open browser console (F12) for debug logs"
echo ""
echo "🔍 Debug Features:"
echo "   • Console shows button clicks with 🔵 emoji"
echo "   • Email validation logged with ✅/❌ status"
echo "   • State tracking for form inputs"
echo "   • Step navigation debugging"
echo ""
echo "✨ Ready for Step 1 testing in 4 minutes! ✨"

