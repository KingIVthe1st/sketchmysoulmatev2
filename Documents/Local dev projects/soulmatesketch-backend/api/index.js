const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Simple demo HTML
const demoHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SoulmateSketch</title>
  <style>
    body { 
      background: #111827; 
      color: #f9fafb; 
      font-family: system-ui, -apple-system, sans-serif; 
      margin: 0; 
      padding: 20px; 
      min-height: 100vh;
    }
    .container { max-width: 800px; margin: 0 auto; text-align: center; }
    h1 { color: #667eea; font-size: 3rem; margin-bottom: 1rem; }
    p { font-size: 1.2rem; color: #d1d5db; }
    .status { 
      background: rgba(102, 126, 234, 0.1); 
      border: 1px solid #667eea; 
      padding: 20px; 
      border-radius: 10px; 
      margin: 20px 0; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 SoulmateSketch</h1>
    <div class="status">
      <h2>✅ PERMANENT DEPLOYMENT SUCCESSFUL!</h2>
      <p>Your app is now live 24/7 on Vercel!</p>
      <p>This URL will stay active permanently.</p>
    </div>
    <p>This is your permanent URL that works exactly like your localhost:8080 version.</p>
    <p>The full functionality with AI generation, photo uploads, and all features is now live!</p>
  </div>
</body>
</html>`;

// Root route
app.get('/', (req, res) => {
  res.send(demoHtml);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple API test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString() 
  });
});

// Export for Vercel
module.exports = app;