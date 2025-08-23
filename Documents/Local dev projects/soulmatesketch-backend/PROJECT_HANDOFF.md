# 🎯 SoulmateSketch Project Handoff Document

## 📋 **PROJECT OVERVIEW**
**SoulmateSketch** is a web application that generates AI-powered soulmate sketches and personality reports based on user quiz responses. The app uses OpenAI for content generation, Stripe for payments, and is deployed on Render.

---

## 🗂️ **DIRECTORY STRUCTURE & REPOSITORIES**

### **Primary Repositories:**
```
1. DEVELOPMENT REPO (Local work):
   📁 /Users/ivanjackson/Documents/Local dev projects/soulmatesketch-backend/

2. DEPLOYMENT REPO (Auto-deploys to Render):
   📁 /Users/ivanjackson/Documents/Local dev projects/soulsketchv2/
   🔗 GitHub: Connected to Render auto-deployment
```

### **Workflow:**
- **Work in**: `soulmatesketch-backend` (main development)
- **Deploy to**: `soulsketchv2` (copy files → git push → Render deploys)

---

## 📁 **FILE STRUCTURE**

### **🔧 Backend Files (Node.js/Express)**
```
src/
├── server.js          # Main Express server, routes, static file serving
├── routes.js          # API endpoints (/api/orders, /api/create-payment-intent, etc.)
├── db.js             # SQLite database operations
├── ai.js             # OpenAI API integration (text, image, PDF generation)
├── payments.js       # Stripe payment helper functions
└── templates.js      # HTML template generation (legacy, not used for main UI)
```

### **🎨 Frontend Files**
```
public/
├── index.html        # Main landing page (Sketch My Soulmate design)
├── order.html        # 4-step quiz + payment flow
├── css/
│   └── custom.css    # Custom styles, starfield effects, payment UI
├── js/
│   └── custom.js     # Frontend JavaScript, preloader, missing file stubs
└── images/home/      # Website images (hero, pricing, about sections)
    ├── bannerimage.png   # Spanish guy (hero banner)
    ├── blackguy.png      # "Ready to begin?" section
    ├── asianwoman.png    # Personalization section
    └── blonde.png        # Basic pricing plan
```

### **🗄️ Database & Uploads**
```
db/
└── soulmatesketch.sqlite    # SQLite database (orders, user data)

uploads/                     # Generated AI content
├── *_photo.jpg             # AI-generated soulmate images
├── *_report.pdf            # AI-generated personality reports
└── result_*.png            # Additional generated images
```

---

## 🌐 **DEPLOYMENT SETUP**

### **Render Services:**
- **URL**: https://soulsketchv2-clean.onrender.com
- **GitHub Repo**: `soulsketchv2` (auto-deploy enabled)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  OPENAI_API_KEY=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
  STRIPE_SECRET_KEY=[User needs to configure]
  STRIPE_PUBLISHABLE_KEY=[User needs to configure]
  ```

### **Deployment Process:**
```bash
# Universal deployment script (works from any directory):
SOURCE_DIR="/Users/ivanjackson/Documents/Local dev projects/soulmatesketch-backend"
DEPLOY_DIR="/Users/ivanjackson/Documents/Local dev projects/soulsketchv2"

# Copy files
cp "$SOURCE_DIR/public/order.html" "$DEPLOY_DIR/public/"
cp "$SOURCE_DIR/public/css/custom.css" "$DEPLOY_DIR/public/css/"
cp "$SOURCE_DIR/src/server.js" "$DEPLOY_DIR/src/"
cp "$SOURCE_DIR/src/routes.js" "$DEPLOY_DIR/src/"

# Deploy
cd "$DEPLOY_DIR"
git add -A
git commit -m "Deploy updates"
git push origin main
```

---

## 🎮 **APPLICATION FLOW**

### **User Journey:**
1. **Landing Page** (`/`) → `public/index.html`
2. **Start Quiz** → `public/order.html`
3. **4-Step Quiz**:
   - Step 1: Basic Info (name, email, birthdate)
   - Step 2: Personality Traits
   - Step 3: Relationship Preferences  
   - Step 4: Lifestyle & Values
4. **Step 5: Payment** → Stripe checkout
5. **AI Generation** → OpenAI creates PDF + image
6. **Delivery** → User downloads files

### **API Endpoints:**
```
POST /api/orders                 # Create new order
POST /api/create-payment-intent  # Create Stripe payment
POST /api/stripe-webhook         # Handle payment confirmations
POST /api/orders/:id/intake      # Store quiz responses
POST /api/orders/:id/generate    # Generate AI deliverables
```

---

## 🔧 **CURRENT TECHNICAL STATE**

### **✅ WORKING:**
- Starfield visual effects on landing page
- 4-step quiz flow with validation
- OpenAI API integration (text, image, PDF generation)
- File upload and storage system
- Database operations

### **🚧 IN PROGRESS:**
- **Stripe Payment Integration**: Keys need to be configured
- **Step 1 Navigation**: Button positioning and validation debugging
- **Payment Flow**: Step 4 → Step 5 (checkout) → AI generation

### **🔍 DEBUGGING FEATURES:**
- Extensive console logging in `order.html`
- Step navigation tracking with emoji indicators
- Email validation debugging
- Stripe initialization logging

---

## 🛠️ **DEVELOPMENT COMMANDS**

### **Local Development:**
```bash
cd /Users/ivanjackson/Documents/Local\ dev\ projects/soulmatesketch-backend
npm install
npm start    # Runs on http://localhost:8080
```

### **Testing APIs:**
```bash
# Test live APIs
curl https://soulsketchv2-clean.onrender.com/api/orders
curl https://soulsketchv2-clean.onrender.com/images/home/bannerimage.png
```

---

## 🎯 **IMMEDIATE PRIORITIES**

### **Critical Issues to Fix:**
1. **Step 1 Button**: Ensure "Next" button is on right and advances to Step 2
2. **Stripe Setup**: Configure live Stripe keys in Render environment
3. **Payment Flow**: Step 4 "Generate Your Sketch" → Step 5 (Payment) → AI Generation
4. **API Integration**: Ensure OpenAI generates content AFTER payment completion

### **Payment System Requirements:**
- Accept credit cards and Apple Pay
- Connect to user's live Stripe account
- Block AI generation until payment is confirmed
- Generate deliverables after successful payment

---

## 🔑 **IMPORTANT NOTES**

### **File Sync Pattern:**
- Always work in `soulmatesketch-backend`
- Copy changes to `soulsketchv2` for deployment
- Render auto-deploys from `soulsketchv2` GitHub pushes

### **Environment Management:**
- Local: Can run without Stripe (conditional initialization)
- Production: Requires all API keys in Render environment variables

### **UI Design:**
- Main UI is in `public/index.html` (NOT `templates.js`)
- Quiz flow is in `public/order.html`
- Starfield effects are inline in CSS/JS

### **Git Workflow:**
```bash
# If git conflicts occur during sync:
cd /Users/ivanjackson/Documents/Local\ dev\ projects/soulsketchv2
git pull
# Resolve conflicts manually
git add -A
git commit -m "Resolve conflicts"
git push origin main
```

---

## 🚀 **QUICK START FOR NEW AI**

1. **Understand current state**: Read this document
2. **Check live site**: https://soulsketchv2-clean.onrender.com
3. **Test quiz flow**: https://soulsketchv2-clean.onrender.com/order.html
4. **Review recent changes**: Check console logs and step navigation
5. **Priority fix**: Get Step 1 → Step 2 navigation working
6. **Configure Stripe**: Set up payment system
7. **Test complete flow**: Quiz → Payment → AI Generation

---

## 📞 **SUPPORT RESOURCES**

- **Render Dashboard**: Check build logs and environment variables
- **GitHub Repo**: `soulsketchv2` for deployment tracking
- **Console Debugging**: Extensive logging in browser console
- **API Testing**: Use curl commands for endpoint verification

This document contains everything needed to take over the project and continue development. The immediate focus should be completing the payment integration and ensuring the full quiz → payment → AI generation flow works seamlessly.