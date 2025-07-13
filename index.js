const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { URLSearchParams } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

const WORDPRESS_API_URL = 'https://treesbeyondboarders.wordpress.com/wp-json/wp/v2';

app.use(cors());

app.get('/api/:resource', async (req, res) => {
  const { resource } = req.params;
  const params = new URLSearchParams(req.query);
  const fetchUrl = `${WORDPRESS_API_URL}/${resource}?${params}`;

  try {
    const wpRes = await fetch(fetchUrl);
    const data = await wpRes.json();
    
    // Forward headers from WordPress response
    res.setHeader('Content-Type', wpRes.headers.get('content-type'));
    
    // Forward pagination headers
    ['x-wp-total', 'x-wp-totalpages'].forEach(header => {
      if (wpRes.headers.has(header)) {
        res.setHeader(header, wpRes.headers.get(header));
      }
    });

    res.status(wpRes.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch WordPress resource: ${resource}` });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy API running on port ${PORT}`);
});