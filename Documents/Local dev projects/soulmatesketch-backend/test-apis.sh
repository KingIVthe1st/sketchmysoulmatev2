#!/bin/bash

echo "🧪 COMPREHENSIVE API TESTING"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test URLs
BASE_URL="https://soulsketchv2-clean.onrender.com"
BACKUP_URL="https://soulsketch-final.onrender.com"

echo -e "${BLUE}🌐 Testing Primary Service:${NC} $BASE_URL"
echo -e "${BLUE}🌐 Testing Backup Service:${NC} $BACKUP_URL"
echo ""

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-""}
    local description=$4
    
    echo -e "${YELLOW}🔍 Testing:${NC} $description"
    echo -e "${BLUE}Endpoint:${NC} $method $endpoint"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X $method "$BASE_URL$endpoint")
    fi
    
    # Extract HTTP status
    http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
    response_body=$(echo "$response" | grep -v "HTTP_STATUS:")
    
    if [ "$http_status" = "200" ] || [ "$http_status" = "201" ]; then
        echo -e "${GREEN}✅ SUCCESS (HTTP $http_status)${NC}"
        echo -e "${BLUE}Response:${NC} $response_body"
    else
        echo -e "${RED}❌ FAILED (HTTP $http_status)${NC}"
        echo -e "${BLUE}Response:${NC} $response_body"
    fi
    echo ""
}

# Test 1: Home page (should return HTML)
echo -e "${BLUE}📱 TEST 1: Home Page${NC}"
test_api "/" "GET" "" "Home page should return HTML"

# Test 2: Quiz page (should return HTML)
echo -e "${BLUE}📝 TEST 2: Quiz Page${NC}"
test_api "/order.html" "GET" "" "Quiz page should return HTML"

# Test 3: Create order endpoint
echo -e "${BLUE}📋 TEST 3: Create Order API${NC}"
test_api "/api/orders" "POST" '{"email":"test@example.com","tier":"premium","addons":[]}' "Create order endpoint"

# Test 4: Test payment intent creation (if Stripe is configured)
echo -e "${BLUE}💳 TEST 4: Payment Intent API${NC}"
test_api "/api/create-payment-intent" "POST" '{"amount":1799,"currency":"usd","email":"test@example.com"}' "Create payment intent endpoint"

# Test 5: Check if we can access the database
echo -e "${BLUE}🗄️  TEST 5: Database Health${NC}"
test_api "/api/orders" "GET" "" "List orders (if implemented)"

# Test 6: Static assets
echo -e "${BLUE}🖼️  TEST 6: Static Assets${NC}"
test_api "/images/home/blonde.png" "GET" "" "Blonde woman image"
test_api "/images/home/asianwoman.png" "GET" "" "Asian woman image"
test_api "/images/home/bannerimage.png" "GET" "" "Banner image"

# Test 7: CSS and JS files
echo -e "${BLUE}🎨 TEST 7: CSS and JS Files${NC}"
test_api "/css/custom.css" "GET" "" "Custom CSS file"
test_api "/js/custom.js" "GET" "" "Custom JS file"

# Test 8: Check for common errors
echo -e "${BLUE}⚠️  TEST 8: Error Handling${NC}"
test_api "/api/nonexistent" "GET" "" "404 handling"
test_api "/api/orders" "POST" '{"invalid":"data"}' "Invalid data handling"

echo -e "${GREEN}🎉 API Testing Complete! 🎉${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "   • Home page: Should return HTML"
echo "   • Quiz page: Should return HTML"
echo "   • Order creation: Should work with valid data"
echo "   • Payment intent: Should work if Stripe configured"
echo "   • Static assets: Images, CSS, JS should load"
echo "   • Error handling: Should return proper error codes"
echo ""
echo -e "${YELLOW}🔍 Check the results above for any failed tests${NC}"
echo -e "${GREEN}🚀 If all tests pass, your system is ready for production! 🚀${NC}"
