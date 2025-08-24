#!/bin/bash

# Music Moments - Automated DigitalOcean Droplet Deployment
# This script runs FROM your local machine and deploys to the droplet

echo "🚀 MUSIC MOMENTS - AUTOMATED DROPLET DEPLOYMENT"
echo "=============================================="
echo "Target Server: 162.243.172.151"
echo ""

# Server IP
SERVER_IP="162.243.172.151"
SERVER_USER="root"

# Create the remote setup script
cat << 'REMOTE_SCRIPT' > /tmp/remote-deploy.sh
#!/bin/bash

echo "🔧 SETTING UP MUSIC MOMENTS ON DROPLET"
echo "======================================"

# Update system packages
echo "📦 Step 1/8: Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq > /dev/null 2>&1

# Install Node.js 18.x
echo "🟢 Step 2/8: Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
apt-get install -y nodejs > /dev/null 2>&1

# Install required packages
echo "📦 Step 3/8: Installing required packages..."
apt-get install -y git nginx ufw > /dev/null 2>&1

# Install PM2 globally
echo "🔄 Step 4/8: Installing PM2 process manager..."
npm install -g pm2 > /dev/null 2>&1

# Remove old installation if exists
echo "🧹 Step 5/8: Cleaning up old installations..."
pm2 delete music-moments 2>/dev/null || true
rm -rf /var/www/music-moments

# Create application directory and clone repo
echo "📥 Step 6/8: Cloning repository and installing dependencies..."
mkdir -p /var/www/music-moments
cd /var/www/music-moments
git clone https://github.com/KingIVthe1st/songgram.git . > /dev/null 2>&1

# Install dependencies
npm install --production > /dev/null 2>&1

# Build the Next.js application
echo "🔨 Step 7/8: Building Next.js application..."
npm run build

# Create PM2 ecosystem file
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
pm2 start ecosystem.config.js > /dev/null 2>&1
pm2 save > /dev/null 2>&1
pm2 startup systemd -u root --hp /root > /dev/null 2>&1

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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
NGINX_CONFIG

# Enable the site and restart Nginx
ln -sf /etc/nginx/sites-available/music-moments /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t > /dev/null 2>&1
systemctl restart nginx

# Configure firewall
ufw default deny incoming > /dev/null 2>&1
ufw default allow outgoing > /dev/null 2>&1
ufw allow ssh > /dev/null 2>&1
ufw allow 'Nginx Full' > /dev/null 2>&1
echo "y" | ufw enable > /dev/null 2>&1

# Display results
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
echo ""
REMOTE_SCRIPT

# Copy and execute the script on the remote server
echo "📤 Deploying to your droplet..."
echo ""

# Copy the script to the droplet
scp -o StrictHostKeyChecking=no /tmp/remote-deploy.sh $SERVER_USER@$SERVER_IP:/tmp/remote-deploy.sh 2>/dev/null

# Execute the script on the droplet
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "chmod +x /tmp/remote-deploy.sh && /tmp/remote-deploy.sh"

echo ""
echo "🎊 DEPLOYMENT COMPLETE!"
echo "======================"
echo "🌐 Your app is now live at: http://162.243.172.151"
echo ""
echo "To check the status, SSH into your droplet and run:"
echo "   ssh root@162.243.172.151"
echo "   pm2 status"