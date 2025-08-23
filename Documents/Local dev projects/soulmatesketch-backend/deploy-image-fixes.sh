#!/bin/bash
set -e

echo "🚀 DEPLOYING IMAGE FIXES TO RENDER"
echo "=================================="
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

# Step 1: Copy updated files
echo -e "${YELLOW}📦 Step 1: Copying updated files...${NC}"

# Copy the updated HTML file
echo "  • Copying updated index.html (Personalization section fix)..."
cp "$SOURCE/public/index.html" "$DEST/public/index.html"

# Copy the updated CSS file
echo "  • Copying updated custom.css (removed duplicate background)..."
cp "$SOURCE/public/css/custom.css" "$DEST/public/css/custom.css"

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
git commit -m "fix: remove duplicate background images + update personalization section

🎨 IMAGE FIXES:
- Removed duplicate background image from 'Start Your Sketch' section
- Black guy image now fills entire space without overlay
- Updated Personalization section to use Asian woman image

🔧 CSS UPDATES:
- Removed background: url('../images/home/pricing-right.jpg') from .service-cta-box
- Made .service-cta-box::before transparent
- Cleaned up duplicate image effects

📱 VISUAL IMPROVEMENTS:
- Clean, single image display in CTA section
- Asian woman image now in Personalization section
- Better visual hierarchy and spacing

Ready for production! 🚀"

# Step 5: Push to trigger Render deployment
echo ""
echo -e "${YELLOW}🌐 Step 5: Deploying to Render...${NC}"
git push origin main

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE! 🎉${NC}"
echo ""
echo -e "${BLUE}📱 Your updated application is now deploying to:${NC}"
echo "   • https://soulsketchv2-clean.onrender.com"
echo "   • https://soulsketch-final.onrender.com"
echo ""
echo -e "${YELLOW}⏱️  Wait 2-3 minutes for Render to complete the build${NC}"
echo ""
echo -e "${GREEN}🧪 Test your live sites:${NC}"
echo "   • 'Start Your Sketch' section: Single black guy image (no duplicate)"
echo "   • Personalization section: Asian woman image"
echo "   • Clean visual hierarchy throughout"
echo ""
echo -e "${BLUE}🎯 Success Criteria:${NC}"
echo "   ✅ No duplicate background images in CTA section"
echo "   ✅ Black guy image fills entire space"
echo "   ✅ Asian woman image in Personalization section"
echo "   ✅ Clean, professional appearance"
echo ""
echo -e "${GREEN}🚀 Ready for your investor demo! 🚀${NC}"
