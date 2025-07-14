const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

// Optional: Middleware to log every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy route: Posts
app.get('/api/posts', async (req, res) => {
  const query = req.originalUrl.split('?')[1] || '';
  const wpUrl = `https://treesbeyondboarders.wordpress.com/wp-json/wp/v2/posts${query ? '?' + query : ''}`;
  
  try {
    const wpRes = await fetch(wpUrl);
    const text = await wpRes.text();

    if (!wpRes.ok) {
      console.error('WP API error:', wpRes.status, text);
      return res.status(wpRes.status).send(text);
    }

    const json = JSON.parse(text);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(json);
  } catch (err) {
    console.error('Proxy error (posts):', err.message);
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
});

// Proxy route: Categories
app.get('/api/categories', async (req, res) => {
  const query = req.originalUrl.split('?')[1] || '';
  const wpUrl = `https://treesbeyondboarders.wordpress.com/wp-json/wp/v2/categories${query ? '?' + query : ''}`;

  try {
    const wpRes = await fetch(wpUrl);
    const text = await wpRes.text();

    if (!wpRes.ok) {
      console.error('WP API error:', wpRes.status, text);
      return res.status(wpRes.status).send(text);
    }

    const json = JSON.parse(text);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(json);
  } catch (err) {
    console.error('Proxy error (categories):', err.message);
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
});

// Optional: Homepage
app.get('/', (req, res) => {
  res.send("✅ WordPress CORS proxy is running. Use /api/posts or /api/categories.");
});

module.exports = app;
