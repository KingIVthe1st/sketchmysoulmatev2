#!/usr/bin/env node

/**
 * Debug Configuration Tool for Music Moments
 * This tool helps diagnose common configuration and environment issues
 */

const http = require('http');
const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Music Moments Configuration Debugger\n');

// Check environment
console.log('📋 Environment Check:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`- PORT: ${process.env.PORT || 'undefined'}`);
console.log(`- NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'undefined'}`);
console.log(`- ELEVENLABS_API_KEY: ${process.env.ELEVENLABS_API_KEY ? 'SET (***' + process.env.ELEVENLABS_API_KEY.slice(-4) + ')' : 'NOT SET'}`);

// Check if .env files exist
const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
console.log('\n📁 Environment Files:');
envFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`- ${file}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
});

// Check ports
console.log('\n🔌 Port Status:');
const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => {
      server.close(() => resolve(false)); // Port is free
    });
    server.on('error', () => resolve(true)); // Port is in use
  });
};

Promise.all([
  checkPort(3000),
  checkPort(3001),
  checkPort(3002)
]).then(results => {
  console.log(`- Port 3000: ${results[0] ? 'IN USE' : 'FREE'}`);
  console.log(`- Port 3001: ${results[1] ? 'IN USE' : 'FREE'}`);
  console.log(`- Port 3002: ${results[2] ? 'FREE (BACKUP)' : 'FREE'}`);

  // Check what's running on common ports
  console.log('\n🔄 Running Processes:');
  try {
    const ps3000 = execSync('lsof -ti:3000 2>/dev/null || echo "none"').toString().trim();
    const ps3001 = execSync('lsof -ti:3001 2>/dev/null || echo "none"').toString().trim();
    console.log(`- Port 3000 PID: ${ps3000}`);
    console.log(`- Port 3001 PID: ${ps3001}`);
  } catch (e) {
    console.log('- Could not check process information');
  }

  // Test internal API connectivity
  console.log('\n🌐 API Connectivity Test:');
  
  const testEndpoint = (url, name) => {
    return new Promise((resolve) => {
      const request = url.startsWith('https') ? https : http;
      const req = request.get(url, { timeout: 5000 }, (res) => {
        console.log(`✅ ${name}: Connected (${res.statusCode})`);
        resolve(true);
      });
      
      req.on('error', (err) => {
        console.log(`❌ ${name}: Failed - ${err.message}`);
        resolve(false);
      });
      
      req.on('timeout', () => {
        req.destroy();
        console.log(`⏰ ${name}: Timeout`);
        resolve(false);
      });
    });
  };

  Promise.all([
    testEndpoint('http://localhost:3000/api/generate', 'localhost:3000/api/generate'),
    testEndpoint('http://localhost:3001/api/generate', 'localhost:3001/api/generate')
  ]).then(() => {
    console.log('\n🎯 Recommendations:');
    
    if (!process.env.ELEVENLABS_API_KEY) {
      console.log('❗ Add ELEVENLABS_API_KEY to your environment variables');
    }
    
    if (results[0] && results[1]) {
      console.log('⚠️  Both ports 3000 and 3001 are in use');
      console.log('   Consider stopping one service or using a different port');
    } else if (results[0] && !results[1]) {
      console.log('💡 Port 3000 is in use, consider running on port 3001:');
      console.log('   npm run dev -- --port 3001');
    } else if (!results[0]) {
      console.log('✅ Port 3000 is available - you can run the app normally');
    }

    console.log('\n🚀 Quick Fixes:');
    console.log('1. Set environment variables: cp .env.example .env');
    console.log('2. Install dependencies: npm install');
    console.log('3. Run on specific port: npm run dev -- --port 3001');
    console.log('4. Check logs: tail -f .next/trace.log (if exists)');
    
    console.log('\n✅ Configuration check complete!');
  });
}).catch(err => {
  console.error('❌ Error during configuration check:', err);
});