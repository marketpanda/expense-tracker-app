// Local-only static server for reviewing Expo's production web export.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../dist');
const port = Number(process.env.CASHCOMPASS_PORT || 8083);
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.json': 'application/json', '.ico': 'image/x-icon' };

http.createServer((request, response) => {
  let relative;
  try { relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\/+/, ''); }
  catch { response.writeHead(400).end('Invalid URL'); return; }
  let target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep) && target !== root) { response.writeHead(403).end('Forbidden'); return; }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    if (path.extname(target)) { response.writeHead(404).end('Not found'); return; }
    target = path.join(root, 'index.html');
  }
  if (!fs.existsSync(target)) { response.writeHead(404).end('Run npx expo export --platform web first.'); return; }
  response.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`Local preview: http://localhost:${port}`));
