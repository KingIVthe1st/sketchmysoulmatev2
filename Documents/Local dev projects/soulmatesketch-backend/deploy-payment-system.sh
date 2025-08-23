#!/bin/bash
set -e

echo "🚀 DEPLOYING STRIPE PAYMENT SYSTEM TO RENDER"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Source and destination directories
SOURCE="/Users/ivanjackson/Documents/Local dev projects/soulmatesketch-backend"
DEST="/Users/ivanjackson/Documents/Local dev projects/soulsketchv2"

echo -e "${BLUE}📁 Source:${NC} $SOURCE"
echo -e "${BLUE}📁 Destination:${NC} $DEST"
echo ""

# Step 1: Copy all updated files
echo -e "${YELLOW}📦 Step 1: Copying payment system files...${NC}"

# Copy main application files
echo "  • Copying updated order.html (5-step quiz + Stripe integration)..."
cp "$SOURCE/public/order.html" "$DEST/public/order.html"

echo "  • Copying updated routes.js (payment endpoints)..."
cp "$SOURCE/src/routes.js" "$DEST/src/routes.js"

echo "  • Copying updated package.json (Stripe dependency)..."
cp "$SOURCE/package.json" "$DEST/package.json"

echo "  • Copying updated custom.css (payment styles)..."
cp "$SOURCE/public/css/custom.css" "$DEST/public/css/custom.css"

echo "  • Copying Stripe setup documentation..."
cp "$SOURCE/STRIPE_SETUP.md" "$DEST/STRIPE_SETUP.md"

echo -e "${GREEN}✅ Files copied successfully!${NC}"
echo ""

# Step 2: Navigate to deployment repo
echo -e "${YELLOW}📂 Step 2: Preparing deployment...${NC}"
cd "$DEST"

# Check git status
echo "  • Checking git status..."
git status --porcelain

# Step 3: Stage all changes
echo ""
echo -e "${YELLOW}📋 Step 3: Staging changes...${NC}"
git add -A

# Step 4: Commit with detailed message
echo ""
echo -e "${YELLOW}💬 Step 4: Committing changes...${NC}"
git commit -m "feat: complete Stripe payment integration

💳 STRIPE PAYMENT SYSTEM:
- Added Step 5: Secure checkout with Stripe Elements
- Credit card + Apple Pay support
- Real-time payment processing
- PCI compliant payment forms

🔧 BACKEND UPDATES:
- POST /api/create-payment-intent endpoint
- POST /api/stripe-webhook endpoint  
- Updated orders table with payment tracking
- Payment verification before AI generation

🎨 FRONTEND UPDATES:
- 5-step quiz flow (added payment step)
- Stripe Elements integration
- Payment loading states and error handling
- Order summary with $17.99 pricing

📱 FEATURES:
- Mobile-optimized payment forms
- Apple Pay automatic detection
- Secure SSL encryption
- Professional checkout experience

🔒 SECURITY:
- Server-side payment verification
- Webhook signature validation
- PCI compliant card handling
- Payment intent confirmation

Ready for production payments! 💰🚀"

# Step 5: Push to trigger Render deployment
echo ""
echo -e "${YELLOW}🌐 Step 5: Deploying to Render...${NC}"
git push origin main

echo ""
echo -e "${GREEN}🎉 PAYMENT SYSTEM DEPLOYED! 🎉${NC}"
echo ""
echo -e "${BLUE}📱 Your payment-enabled application is now deploying to:${NC}"
echo "   • https://soulsketchv2-clean.onrender.com"
echo "   • https://soulsketch-final.onrender.com"
echo ""
echo -e "${YELLOW}⏱️  Wait 3-5 minutes for Render to complete the build${NC}"
echo ""
echo -e "${RED}🔑 IMPORTANT: SET UP STRIPE KEYS BEFORE TESTING${NC}"
echo "   1. Go to Render service dashboard"
echo "   2. Navigate to 'Environment' tab"
echo "   3. Add: STRIPE_SECRET_KEY=sk_test_your_key"
echo "   4. Add: STRIPE_PUBLISHABLE_KEY=pk_test_your_key"
echo "   5. Update public/order.html with your publishable key"
echo ""
echo -e "${GREEN}🧪 Test your payment system:${NC}"
echo "   • Complete the 5-step quiz"
echo "   • Test with card: 4242 4242 4242 4242"
echo "   • Verify Apple Pay appears on iOS devices"
echo "   • Confirm AI generation after payment"
echo ""
echo -e "${BLUE}📚 Setup Guide:${NC}"
echo "   • See STRIPE_SETUP.md for detailed instructions"
echo "   • Get your keys: https://dashboard.stripe.com/"
echo ""
echo -e "${GREEN}💰 Ready to accept real payments! 🚀${NC}"
