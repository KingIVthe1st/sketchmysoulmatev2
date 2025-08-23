#!/bin/bash
set -e

echo "🚀 DEPLOYING BLONDE WOMAN IMAGE UPDATE"
echo "======================================"
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
echo "  • Copying updated index.html (blonde woman in Basic pricing)..."
cp "$SOURCE/public/index.html" "$DEST/public/index.html"

# Copy the blonde woman image
echo "  • Copying blonde woman image..."
cp "$SOURCE/blonde.png" "$DEST/public/images/home/blonde.png"

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
git commit -m "feat: update Basic pricing section image

🎨 IMAGE UPDATE:
- Replaced Asian woman image with blonde woman in Basic pricing section
- Updated alt text to reflect new image
- Maintains visual consistency with pricing layout

📱 VISUAL IMPROVEMENTS:
- Basic plan now features blonde woman example
- Better visual variety across pricing tiers
- Enhanced user experience with diverse representation

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
echo "   • Basic pricing section: Blonde woman image"
echo "   • Plus pricing: Enhanced features"
echo "   • Premium pricing: Rush delivery"
echo ""
echo -e "${BLUE}🎯 Success Criteria:${NC}"
echo "   ✅ Basic pricing shows blonde woman image"
echo "   ✅ All pricing tiers display correctly"
echo "   ✅ Visual consistency maintained"
echo ""
echo -e "${GREEN}🚀 Ready for your investor demo! 🚀${NC}"
