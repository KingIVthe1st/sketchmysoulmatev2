// Vercel serverless function entry point
const express = require('express');
const path = require('path');

// Import your existing server setup
const app = express();

// Import routes and middleware from your existing structure
const routes = require('../src/routes');
const { demoHtml } = require('../src/templates');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Main demo route
app.get('/', (req, res) => {
  const html = demoHtml({ baseUrl: req.protocol + '://' + req.get('host') });
  res.send(html);
});

// API routes
app.use('/api', routes);

// Export for Vercel
module.exports = app;
