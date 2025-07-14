const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Proxy for posts
app.get('/api/posts', async (req, res) => {
  const baseUrl = 'https://treesbeyondboarders.wordpress.com/wp-json/wp/v2/posts';
  const query = req.originalUrl.split('?')[1] || '';
  const wpUrl = `${baseUrl}${query ? '?' + query : ''}`;

  try {
    const wpRes = await fetch(wpUrl);
    const data = await wpRes.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(wpRes.status).json(data);
  } catch (error) {
    console.error('Fetch posts failed:', error.message);
    res.status(500).json({ error: 'Failed to fetch WordPress posts' });
  }
});

// Proxy for categories
app.get('/api/categories', async (req, res) => {
  const baseUrl = 'https://treesbeyondboarders.wordpress.com/wp-json/wp/v2/categories';
  const query = req.originalUrl.split('?')[1] || '';
  const wpUrl = `${baseUrl}${query ? '?' + query : ''}`;

  try {
    const wpRes = await fetch(wpUrl);
    const data = await wpRes.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(wpRes.status).json(data);
  } catch (error) {
    console.error('Fetch categories failed:', error.message);
    res.status(500).json({ error: 'Failed to fetch WordPress categories' });
  }
});

module.exports = app;
