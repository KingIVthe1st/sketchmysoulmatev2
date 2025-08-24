#!/bin/bash

# Enhanced Music Generation Deployment Script for DigitalOcean
# This script deploys the updated SongGram features including:
# - Expanded musical genres (hip hop, ballads, country, etc.)
# - Enhanced prompt generation using all user input as inspiration
# - 1-minute song duration setting

echo "🚀 Deploying Enhanced SongGram Features to DigitalOcean..."

# DigitalOcean droplet details
DROPLET_IP="162.243.172.151"
DEPLOY_PATH="/var/www/music-moments"

echo "📦 Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build completed successfully"

echo "📂 Preparing deployment files..."

# Create deployment package
rsync -avz --progress \
  --include="app/" \
  --include="app/**" \
  --include=".next/" \
  --include=".next/**" \
  --include="package.json" \
  --include="package-lock.json" \
  --include=".env.example" \
  --include="next.config.js" \
  --include="tsconfig.json" \
  --exclude="*" \
  . deploy-temp/

echo "🔄 Deploying to DigitalOcean droplet..."

# Note: SSH key must be properly configured for automatic deployment
# To deploy manually, use these commands:

cat << EOF
📋 Manual Deployment Instructions:

1. Copy files to server:
   scp -r deploy-temp/* root@${DROPLET_IP}:${DEPLOY_PATH}/

2. SSH into server and restart:
   ssh root@${DROPLET_IP}
   cd ${DEPLOY_PATH}
   npm install --production
   pm2 restart music-moments || pm2 start "npm start" --name music-moments

3. Check deployment:
   curl http://${DROPLET_IP}:3000

🌟 Enhanced Features Deployed:
- ✅ 11 new musical genres (hip hop, ballads, country, rock, R&B, jazz, folk, reggae, electronic, blues, indie)
- ✅ Intelligent prompt generation that uses all user input as creative inspiration
- ✅ 1-minute song duration for perfect personal music moments
- ✅ Enhanced story theme extraction for more personalized lyrics

🎵 Test the new features at: http://${DROPLET_IP}:3000
EOF

echo "🎉 Enhanced SongGram deployment prepared!"
echo "🔗 Use the manual instructions above to complete deployment"

# Clean up
rm -rf deploy-temp/