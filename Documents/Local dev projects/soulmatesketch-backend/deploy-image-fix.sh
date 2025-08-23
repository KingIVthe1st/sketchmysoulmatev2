#!/bin/bash
set -e

echo "🚀 DEPLOYING IMAGE CROPPING FIX"
echo "================================"
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
echo -e "${YELLOW}📦 Step 1: Copying image fix files...${NC}"

# Copy the updated HTML file
echo "  • Copying updated index.html (image styling fixes)..."
cp "$SOURCE/public/index.html" "$DEST/public/index.html"

# Copy the updated CSS file
echo "  • Copying updated custom.css (removed image cropping constraints)..."
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
git commit -m "fix: resolve image cropping issue in Basic pricing section

🎨 IMAGE FIXES:
- Fixed blonde woman image cropping in Basic pricing section
- Removed CSS aspect-ratio constraint (1 / 0.65)
- Changed object-fit from 'cover' to 'contain'
- Added inline styling for full image visibility

🔧 CSS UPDATES:
- Updated .service-box-image img styles
- Removed forced aspect ratio that was cutting off heads
- Ensured images display at full height without cropping
- Maintained responsive width (100%)

📱 VISUAL IMPROVEMENTS:
- Full head and face now visible in pricing images
- Better user experience with complete image display
- Maintains responsive design across devices
- Professional appearance for investor demo

Ready for production! 🚀"

# Step 5: Push to trigger Render deployment
echo ""
echo -e "${YELLOW}🌐 Step 5: Deploying to Render...${NC}"
git push origin main

echo ""
echo -e "${GREEN}🎉 IMAGE FIX DEPLOYED! 🎉${NC}"
echo ""
echo -e "${BLUE}📱 Your updated application is now deploying to:${NC}"
echo "   • https://soulsketchv2-clean.onrender.com"
echo "   • https://soulsketch-final.onrender.com"
echo ""
echo -e "${YELLOW}⏱️  Wait 2-3 minutes for Render to complete the build${NC}"
echo ""
echo -e "${GREEN}🧪 Test your live sites:${NC}"
echo "   • Basic pricing: Blonde woman image (full head visible)"
echo "   • Plus pricing: Enhanced features"
echo "   • Premium pricing: Rush delivery"
echo ""
echo -e "${BLUE}🎯 Success Criteria:${NC}"
echo "   ✅ Blonde woman's full head is visible"
echo "   ✅ No image cropping in pricing section"
echo "   ✅ Responsive design maintained"
echo "   ✅ Professional appearance for demo"
echo ""
echo -e "${GREEN}🚀 Ready for your investor demo! 🚀${NC}"
