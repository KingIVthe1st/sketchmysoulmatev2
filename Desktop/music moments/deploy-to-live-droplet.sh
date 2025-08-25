#!/bin/bash

echo "🚀 Deploying Enhanced SongGram with iPhone Optimizations and 5 New Musical Styles to Live Droplet..."

# Configuration
DROPLET_IP="162.243.172.151"
SSH_KEY="~/.ssh/do_deployment_key"
REMOTE_PATH="/var/www"
APP_NAME="music-moments"

echo "📋 Deployment Configuration:"
echo "  • Target: $DROPLET_IP"
echo "  • App Path: $REMOTE_PATH/$APP_NAME"
echo "  • SSH Key: $SSH_KEY"
echo ""

# Test SSH connectivity first
echo "🔧 Testing SSH connectivity..."
if ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@$DROPLET_IP "echo 'SSH connection successful'"; then
    echo "✅ SSH connection established"
else
    echo "❌ SSH connection failed. Please check:"
    echo "  • SSH key permissions: chmod 600 $SSH_KEY"
    echo "  • Droplet is running and accessible"
    echo "  • Password reset completed"
    exit 1
fi

echo ""
echo "📦 Building application locally first..."

# Build locally to ensure no errors
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Please fix build errors before deployment."
    exit 1
fi

echo "✅ Local build successful"
echo ""

# Create remote backup
echo "💾 Creating remote backup..."
ssh -i $SSH_KEY root@$DROPLET_IP "cd $REMOTE_PATH && [ -d $APP_NAME ] && cp -r $APP_NAME ${APP_NAME}-backup-$(date +%Y%m%d-%H%M%S) || echo 'No existing app to backup'"

echo ""
echo "📤 Uploading enhanced codebase..."

# Upload application files (excluding build artifacts and node_modules)
rsync -avz -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude deploy-*.sh \
  --exclude "*.log" \
  . root@$DROPLET_IP:$REMOTE_PATH/$APP_NAME/

if [ $? -ne 0 ]; then
    echo "❌ File upload failed"
    exit 1
fi

echo "✅ Files uploaded successfully"
echo ""

# Remote installation and deployment
echo "🔧 Installing dependencies and building on server..."

ssh -i $SSH_KEY root@$DROPLET_IP << 'EOF'
    cd /var/www/music-moments
    
    echo "📋 Current directory contents:"
    ls -la
    
    echo ""
    echo "🔧 Installing Node.js dependencies..."
    npm install --production
    
    echo ""
    echo "🏗️ Building application on server..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Server build failed"
        exit 1
    fi
    
    echo "✅ Server build successful"
    echo ""
    
    echo "🔄 Restarting application services..."
    
    # Kill existing processes
    echo "🛑 Stopping existing application..."
    fuser -k 3000/tcp 2>/dev/null || true
    fuser -k 80/tcp 2>/dev/null || true
    pkill -f "npm start" 2>/dev/null || true
    pkill -f "node.*next" 2>/dev/null || true
    
    # Wait for processes to terminate
    sleep 3
    
    echo "🚀 Starting enhanced application..."
    
    # Start application in background
    nohup npm start > app.log 2>&1 &
    echo $! > app.pid
    
    echo "⏳ Waiting for application startup..."
    sleep 5
    
    # Check if process is running
    if [ -f app.pid ] && kill -0 $(cat app.pid) 2>/dev/null; then
        echo "✅ Application process started successfully (PID: $(cat app.pid))"
    else
        echo "❌ Application failed to start"
        echo "📋 Last few log lines:"
        tail -20 app.log
        exit 1
    fi
EOF

if [ $? -ne 0 ]; then
    echo "❌ Remote deployment failed"
    exit 1
fi

echo ""
echo "🔍 Verifying deployment..."

# Wait for application to fully start
sleep 10

# Test the deployment
response=$(curl -s -o /dev/null -w "%{http_code}" http://$DROPLET_IP)

if [ "$response" = "200" ]; then
    echo "✅ Deployment verification successful! HTTP status: $response"
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE! 🎉"
    echo ""
    echo "🌟 Enhanced SongGram Features Deployed:"
    echo "   📱 iPhone Optimizations:"
    echo "      • Touch-friendly mobile interface"
    echo "      • PWA capabilities for home screen installation"
    echo "      • iOS Safari audio player optimization"
    echo "      • Safe area viewport handling"
    echo "      • Enhanced responsive design"
    echo ""
    echo "   🎵 5 New Musical Styles Added:"
    echo "      • 📻 Old School Rap"
    echo "      • 🔥 Trap"
    echo "      • 🌍 Afrobeats"
    echo "      • 🎶 Latin"
    echo "      • 🙏 Gospel"
    echo ""
    echo "   ⏰ Fixed Timeout Issues:"
    echo "      • Accurate 45-90 second generation timing"
    echo "      • Proper progress messaging"
    echo "      • Enhanced user experience during song creation"
    echo ""
    echo "🌐 Live Application: http://$DROPLET_IP"
    echo "📊 Monitor logs: ssh -i $SSH_KEY root@$DROPLET_IP 'cd $REMOTE_PATH/$APP_NAME && tail -f app.log'"
else
    echo "❌ Deployment verification failed. HTTP status: $response"
    echo "🔧 Check application logs:"
    echo "   ssh -i $SSH_KEY root@$DROPLET_IP 'cd $REMOTE_PATH/$APP_NAME && tail -20 app.log'"
fi

echo ""
echo "🎯 Deployment process complete!"