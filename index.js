const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Proxy for posts
app.get('/api/posts', async (req, res) => {
  try {
    const wpRes = await fetch('https://treesbeyondboarders.wordpress.com/wp-json/wp/v2/posts?page=1&per_page=10&_embed');
    const data = await wpRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch WordPress posts' });
  }
});

// Proxy for categories
app.get('/api/categories', async (req, res) => {
  try {
    const wpRes = await fetch('https://treesbeyondboarders.wordpress.com/wp-json/wp/v2/categories');
    const data = await wpRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch WordPress categories' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy API running on port ${PORT}`);
});