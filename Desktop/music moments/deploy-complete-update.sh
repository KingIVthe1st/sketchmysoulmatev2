#!/bin/bash

echo "🚀 Deploying complete SongGram update with iPhone optimizations and new musical styles..."

# Build application locally first
echo "📦 Building application locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Aborting deployment."
    exit 1
fi

echo "✅ Local build successful. Proceeding with deployment..."

# Deploy to production server
echo "🚢 Deploying to production server..."

# Create remote backup
ssh root@162.243.172.151 "cd /var/www && cp -r music-moments music-moments-backup-$(date +%Y%m%d-%H%M%S)"

# Upload entire codebase
echo "📤 Uploading codebase..."
rsync -avz --exclude node_modules --exclude .next --exclude .git . root@162.243.172.151:/var/www/music-moments/

# Install dependencies and build on server
echo "🔧 Installing dependencies and building on server..."
ssh root@162.243.172.151 "cd /var/www/music-moments && npm install --production"

# Build on server
ssh root@162.243.172.151 "cd /var/www/music-moments && npm run build"

# Kill existing process and restart
echo "🔄 Restarting application..."
ssh root@162.243.172.151 "fuser -k 3000/tcp || true"
ssh root@162.243.172.151 "cd /var/www/music-moments && nohup npm start > app.log 2>&1 & echo \$! > app.pid"

# Wait for startup
echo "⏳ Waiting for application startup..."
sleep 5

# Verify deployment
echo "🔍 Verifying deployment..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://162.243.172.151:3000)

if [ "$response" = "200" ]; then
    echo "✅ Deployment successful! Application is running on http://162.243.172.151:3000"
    echo "🎵 New features deployed:"
    echo "   - iPhone optimizations with touch-friendly interface"
    echo "   - PWA capabilities for mobile installation"
    echo "   - 5 new musical styles: Old School Rap, Trap, Afrobeats, Latin, Gospel"
    echo "   - Fixed timeout messaging (45-90 seconds accurate timing)"
    echo "   - Enhanced mobile responsiveness"
else
    echo "❌ Deployment verification failed. HTTP status: $response"
    echo "Check logs with: ssh root@162.243.172.151 'cd /var/www/music-moments && tail -n 50 app.log'"
fi

echo "🎯 Deployment complete!"