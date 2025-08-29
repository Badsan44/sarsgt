import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

function ogImagePlugin() {
  const makeSvg = (rawCode) => {
    const code = String(rawCode || 'REF')
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, '');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628">\n  <defs>\n    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">\n      <stop offset="0%" stop-color="#0a1420"/>\n      <stop offset="100%" stop-color="#1f2e43"/>\n    </linearGradient>\n  </defs>\n  <rect width="100%" height="100%" fill="url(#g)"/>\n  <text x="60" y="120" fill="#fff" font-size="72" font-family="sans-serif" font-weight="700">Buy $TOKEN</text>\n  <rect x="60" y="160" rx="18" ry="18" width="260" height="70" fill="#d22626" stroke="#b91c1c" stroke-width="4"/>\n  <text x="88" y="208" fill="#fff" font-size="36" font-family="sans-serif" font-weight="700">Buy Now</text>\n  <text x="60" y="280" fill="#dfe7ef" font-size="32" font-family="sans-serif">Use code {${code}} to auto-apply your ref link</text>\n  <text x="1200" y="628" text-anchor="end" dominant-baseline="ideographic" fill="rgba(255,255,255,0.85)" font-size="26" font-family="monospace">{${code}}</text>\n</svg>`;
  };

  const handler = (req, res, next) => {
    const url = req.url || '';
    const m = url.match(/^\/og\/([^\/]+)\.svg(?:\?.*)?$/);
    if (m) {
      const code = decodeURIComponent(m[1] || 'REF');
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'no-cache');
      res.end(makeSvg(code));
      return;
    }
    next();
  };

  return {
    name: 'og-image-middleware',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(previewServer) {
      previewServer.middlewares.use(handler);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ogImagePlugin()],
  base: "",
  server: { 
    port: 12001,
    host: "0.0.0.0",
    strictPort: true,
    cors: true,
    allowedHosts: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy": "frame-ancestors *"
    }
  },
  preview: {
    port: 12000,
    host: "0.0.0.0",
    strictPort: true,
    cors: true,
    allowedHosts: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy": "frame-ancestors *"
    }
  }
});
