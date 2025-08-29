import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));


// Simple dynamic OG image (SVG) showing Buy $TOKEN and referral code
app.get('/og/:code.svg', (req, res) => {
  const code = (req.params.code || 'REF').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a1420"/>
      <stop offset="100%" stop-color="#1f2e43"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="60" y="120" fill="#fff" font-size="72" font-family="sans-serif" font-weight="700">Buy $TOKEN</text>
  <rect x="60" y="160" rx="18" ry="18" width="260" height="70" fill="#d22626" stroke="#b91c1c" stroke-width="4"/>
  <text x="88" y="208" fill="#fff" font-size="36" font-family="sans-serif" font-weight="700">Buy Now</text>
  <text x="60" y="280" fill="#dfe7ef" font-size="32" font-family="sans-serif">Use code {${code}} to auto-apply your ref link</text>
  <text x="1200" y="628" text-anchor="end" dominant-baseline="ideographic" fill="rgba(255,255,255,0.85)" font-size="26" font-family="monospace">{${code}}</text>
</svg>`;
  res.set('Content-Type', 'image/svg+xml');
  res.set('Cache-Control', 'no-cache');
  res.send(svg);
});

// Minimal buy widget for embedding
app.get('/embed/buy-widget.html', (req, res) => {
  const ref = String(req.query.ref || '').replace(/[^A-Za-z0-9_-]/g, '');
  const buyUrl = `/#/?ref=${ref}`;
  res.set('Content-Type', 'text/html');
  res.send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>body{margin:0;font-family:sans-serif;background:#0a1420;color:#fff} .card{border:2px solid #d22626;border-radius:12px;padding:16px;margin:0;background:#0f1a2a} .btn{background:linear-gradient(135deg,#d22626,#b91c1c);color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block}</style>
</head>
<body><div class="card"><div style="font-weight:700;font-size:18px;margin-bottom:8px">Buy $TOKEN</div>
<div style="font-size:14px;color:#c8d2dd;margin-bottom:12px">Instant buy link with your referral code.</div>
<a class="btn" href="${buyUrl}" target="_blank" rel="noopener">Buy Now</a>
</div></body></html>`);
});

// For any request that doesn't match a static file, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 12000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  if (PORT === 12000) {
    console.log(`Access via: bnbmaga.xyz`);
  } else if (PORT === 12001) {
    console.log(`Access via: bnbmaga.xyz`);
  }
});