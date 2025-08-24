#!/bin/bash

# Music Moments - DigitalOcean Droplet Deployment Script
# Server: 162.243.172.151 (Ubuntu 24.04 LTS)

echo "🚀 MUSIC MOMENTS - DROPLET DEPLOYMENT"
echo "===================================="
echo "Target Server: 162.243.172.151"
echo "OS: Ubuntu 24.04 LTS"
echo ""

# Step 1: Connect to your droplet
echo "📡 STEP 1: SSH CONNECTION"
echo "Run this command to connect to your droplet:"
echo "ssh root@162.243.172.151"
echo ""
echo "If you need to set up SSH keys, run:"
echo "ssh-copy-id root@162.243.172.151"
echo ""

# Step 2: Server setup commands (to run ON the droplet)
cat << 'DROPLET_COMMANDS' > /tmp/droplet-setup.sh
#!/bin/bash

echo "🔧 SETTING UP SERVER ENVIRONMENT"
echo "================================"

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x (LTS)
echo "🟢 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version:"
node --version
echo "✅ npm version:"
npm --version

# Install PM2 globally for process management
echo "🔄 Installing PM2 process manager..."
npm install -g pm2

# Install Git
echo "📥 Installing Git..."
apt install -y git

# Install Nginx
echo "🌐 Installing Nginx..."
apt install -y nginx

# Install UFW firewall
echo "🛡️ Installing UFW firewall..."
apt install -y ufw

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/music-moments
cd /var/www/music-moments

# Clone the repository
echo "📥 Cloning repository..."
git clone https://github.com/KingIVthe1st/songgram.git .

# Install dependencies
echo "📦 Installing application dependencies..."
npm install

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
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
    max_memory_restart: '1G',
    error_file: '/var/log/music-moments/error.log',
    out_file: '/var/log/music-moments/out.log',
    log_file: '/var/log/music-moments/combined.log',
  }]
};
PM2_CONFIG

# Create log directory
mkdir -p /var/log/music-moments

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "🌐 Configuring Nginx..."
cat << 'NGINX_CONFIG' > /etc/nginx/sites-available/music-moments
server {
    listen 80;
    server_name 162.243.172.151;

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
    }
}
NGINX_CONFIG

# Enable the site
ln -sf /etc/nginx/sites-available/music-moments /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Configure UFW firewall
echo "🛡️ Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Show status
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo "✅ Node.js installed and configured"
echo "✅ Application cloned and built"
echo "✅ PM2 process manager configured"
echo "✅ Nginx reverse proxy configured"
echo "✅ Firewall configured"
echo ""
echo "🌐 Your app should be available at:"
echo "   http://162.243.172.151"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status          - Check app status"
echo "   pm2 logs            - View app logs"
echo "   pm2 restart all     - Restart app"
echo "   systemctl status nginx - Check Nginx status"
echo ""

DROPLET_COMMANDS

echo "📋 DEPLOYMENT INSTRUCTIONS:"
echo "=========================="
echo ""
echo "1️⃣  Copy the setup script to your droplet:"
echo "   scp /tmp/droplet-setup.sh root@162.243.172.151:/tmp/"
echo ""
echo "2️⃣  SSH into your droplet:"
echo "   ssh root@162.243.172.151"
echo ""
echo "3️⃣  Run the setup script:"
echo "   chmod +x /tmp/droplet-setup.sh"
echo "   /tmp/droplet-setup.sh"
echo ""
echo "4️⃣  Your app will be live at:"
echo "   http://162.243.172.151"
echo ""
echo "🔧 WHAT THE SCRIPT DOES:"
echo "✅ Installs Node.js 18.x LTS"
echo "✅ Clones your GitHub repository"
echo "✅ Builds the Next.js application"
echo "✅ Sets up PM2 for process management"
echo "✅ Configures Nginx as reverse proxy"
echo "✅ Sets up firewall security"
echo "✅ Starts your application"
echo ""
echo "🚀 READY TO DEPLOY!"