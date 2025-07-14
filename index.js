const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Always allow CORS
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Proxy for posts
app.get('/api/posts', async (req, res) => {
  const wpUrl = 'https://treesbeyondboarders.wordpress.com/wp-json/wp/v2/posts?page=1&per_page=10&_embed';

  try {
    const wpRes = await fetch(wpUrl);
    const data = await wpRes.json();
    res.setHeader('Access-Control-Allow-Origin', '*'); // Set here too
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Proxy for categories
app.get('/api/categories', async (req, res) => {
  const wpUrl = 'https://treesbeyondboarders.wordpress.com/wp-json/wp/v2/categories';

  try {
    const wpRes = await fetch(wpUrl);
    const data = await wpRes.json();
    res.setHeader('Access-Control-Allow-Origin', '*'); // Set here too
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
