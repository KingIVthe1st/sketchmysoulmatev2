#!/bin/bash

echo "🚨 FIXING STEP 5 PAYMENT CHECKOUT"
echo "================================="
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
echo "📋 Copying fixed order.html with Step 5 payment fixes..."
cp "$SOURCE_DIR/public/order.html" "$DEPLOY_DIR/public/"

if [ $? -eq 0 ]; then
    echo "   ✅ order.html copied successfully"
else
    echo "   ❌ Failed to copy order.html"
    exit 1
fi

echo ""

# Deploy to GitHub/Render
echo "🚀 Deploying Step 5 Payment Fixes..."
cd "$DEPLOY_DIR"

git add -A

git commit -m "🚨 CRITICAL: Fix Step 5 Payment Checkout

✅ PAYMENT STEP FIXES:
• Prevent form submission from bypassing payment step
• Add debugging for Step 5 navigation
• Block AI generation until payment completes
• Fix Stripe initialization with proper error handling

✅ BUTTON FIXES:
• Change 'Generate Your Sketch' to 'Proceed to Checkout'
• Add event.preventDefault() to prevent form submission
• Force navigation to Step 5 before AI processing

✅ FLOW CONTROL:
• Step 4 → Step 5 (Payment) → AI Generation → Completion
• Payment MUST be completed before deliverables generate
• Comprehensive debugging for troubleshooting

CRITICAL: Payment step must appear and work before AI starts"

git push origin main

echo ""
echo "🎉 STEP 5 PAYMENT FIXES DEPLOYED!"
echo "==============================="
echo ""
echo "✅ Fixed Critical Flow:"
echo "   • Step 4: 'Proceed to Checkout' button"
echo "   • Step 5: Stripe payment form (BEFORE AI)"
echo "   • Payment completion triggers AI generation"
echo "   • AI creates deliverables AFTER payment"
echo ""
echo "🌐 Live URL (updating in ~3-4 minutes):"
echo "   • https://soulsketchv2-clean.onrender.com"
echo ""
echo "🧪 CRITICAL TEST SEQUENCE:"
echo "   1. Complete Steps 1-4 of quiz"
echo "   2. Click 'Proceed to Checkout' on Step 4"
echo "   3. Step 5 should show Stripe payment form"
echo "   4. Complete payment with test card: 4242 4242 4242 4242"
echo "   5. ONLY THEN should AI generate deliverables"
echo "   6. User downloads PDF + image after payment"
echo ""
echo "🔍 Debug Info:"
echo "   • Open browser console (F12) for detailed logs"
echo "   • Look for '🔵' and '✅' emoji debug messages"
echo "   • Payment initialization and step navigation logged"
echo ""
echo "✨ Ready for payment testing in 4 minutes! ✨"
