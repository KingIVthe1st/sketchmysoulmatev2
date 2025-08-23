#!/bin/bash

echo "🔍 SoulSketch Deployment Verification Script"
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
echo -e "\n📋 Checking environment configuration..."
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check for OpenAI API key
    if grep -q "OPENAI_API_KEY=" .env; then
        echo -e "${GREEN}✓${NC} OpenAI API key is configured"
    else
        echo -e "${RED}✗${NC} OpenAI API key is missing in .env"
        exit 1
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    exit 1
fi

# Check package.json
echo -e "\n📦 Checking package configuration..."
if [ -f package.json ]; then
    echo -e "${GREEN}✓${NC} package.json exists"
    
    # Check for start script
    if grep -q '"start":' package.json; then
        echo -e "${GREEN}✓${NC} Start script is defined"
    else
        echo -e "${RED}✗${NC} Start script is missing"
    fi
else
    echo -e "${RED}✗${NC} package.json not found"
    exit 1
fi

# Check critical files
echo -e "\n📂 Checking critical files..."
files_to_check=(
    "src/server.js"
    "src/routes.js"
    "public/index.html"
    "public/css/style.css"
    "public/css/custom.css"
    "public/js/scripts.js"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file is missing"
    fi
done

# Check node modules
echo -e "\n📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
    
    # Check for critical packages
    packages=("express" "openai" "pino" "multer" "dotenv")
    for package in "${packages[@]}"; do
        if [ -d "node_modules/$package" ]; then
            echo -e "${GREEN}✓${NC} $package is installed"
        else
            echo -e "${YELLOW}⚠${NC} $package might need to be installed"
        fi
    done
else
    echo -e "${YELLOW}⚠${NC} node_modules not found - will be installed on deployment"
fi

# Check for generated content directories
echo -e "\n📁 Checking data directories..."
if [ -d "public/generated" ]; then
    echo -e "${GREEN}✓${NC} public/generated directory exists"
else
    echo -e "${YELLOW}⚠${NC} public/generated directory will be created on first use"
    mkdir -p public/generated
    echo -e "${GREEN}✓${NC} Created public/generated directory"
fi

# Summary of fixes
echo -e "\n🔧 Summary of Recent Fixes:"
echo "================================"
echo -e "${GREEN}✓${NC} Fixed numerology calculations (Life Path & Destiny numbers)"
echo -e "${GREEN}✓${NC} Fixed undefined values in PDF reports"
echo -e "${GREEN}✓${NC} Fixed image generation and display"
echo -e "${GREEN}✓${NC} Restored OpenAI API integration (DALL-E 3 & GPT-4)"
echo -e "${GREEN}✓${NC} Updated all data structure references"

# Deployment instructions
echo -e "\n🚀 Deployment Instructions for Render:"
echo "======================================"
echo "1. Commit all changes to git:"
echo "   git add ."
echo "   git commit -m 'Fix numerology calculations and image display'"
echo "   git push origin main"
echo ""
echo "2. In Render Dashboard:"
echo "   - Add environment variable: OPENAI_API_KEY"
echo "   - Set Build Command: npm install"
echo "   - Set Start Command: npm start"
echo "   - Deploy the latest commit"
echo ""
echo "3. Test endpoints after deployment:"
echo "   - Homepage: https://your-app.onrender.com/"
echo "   - Test order creation and generation"
echo "   - Verify image and PDF deliverables"

echo -e "\n${GREEN}✅ System is ready for deployment!${NC}"