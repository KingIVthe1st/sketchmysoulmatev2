#!/bin/bash

# Music Moments - Console Deployment Script
# Copy and paste this entire script into your DigitalOcean droplet console

echo "🚀 MUSIC MOMENTS - CONSOLE DEPLOYMENT"
echo "===================================="

# Update system
echo "📦 Step 1/8: Updating system packages..."
apt update -qq && apt upgrade -y -qq

# Install Node.js 18.x
echo "🟢 Step 2/8: Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install required packages
echo "📦 Step 3/8: Installing required packages..."
apt-get install -y git nginx ufw

# Install PM2 globally
echo "🔄 Step 4/8: Installing PM2 process manager..."
npm install -g pm2

# Remove old installation if exists
echo "🧹 Step 5/8: Cleaning up old installations..."
pm2 delete music-moments 2>/dev/null || true
rm -rf /var/www/music-moments

# Create application directory and clone repo
echo "📥 Step 6/8: Cloning repository and installing dependencies..."
mkdir -p /var/www/music-moments
cd /var/www/music-moments
git clone https://github.com/KingIVthe1st/songgram.git .

# Install dependencies and build
npm install --production
echo "🔨 Building Next.js application..."
npm run build

# Create PM2 ecosystem file
echo "⚙️ Step 7/8: Setting up PM2 configuration..."
cat << 'PM2_CONFIG' > ecosystem.config.js
module.exports = {
  apps: [{
    name: 'music-moments',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/music-moments',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
PM2_CONFIG

# Start the application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

# Configure Nginx
echo "🌐 Step 8/8: Configuring Nginx..."
cat << 'NGINX_CONFIG' > /etc/nginx/sites-available/music-moments
server {
    listen 80;
    server_name 162.243.172.151;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
NGINX_CONFIG

# Enable the site and restart Nginx
ln -sf /etc/nginx/sites-available/music-moments /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Configure firewall
echo "🛡️ Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
echo "y" | ufw enable

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "🎉 Your Music Moments app is now live at:"
echo "   http://162.243.172.151"
echo ""
echo "📊 Status Check:"
pm2 status
echo ""
echo "🔧 Useful commands:"
echo "   pm2 logs music-moments    - View app logs"
echo "   pm2 restart music-moments - Restart app"  
echo "   pm2 monit                 - Monitor app performance"
echo "   systemctl status nginx    - Check Nginx status"
echo ""