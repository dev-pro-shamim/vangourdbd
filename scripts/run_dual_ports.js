const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Spawn Next.js on port 3001
console.log('Starting Next.js on port 3001...');
const nextProcess = spawn('npx.cmd', ['next', 'start', '-p', '3001'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js process:', err);
});

// 2. Start reverse proxy on port 3000 to forward to 3001
const proxy = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Next.js server is booting up on port 3001, please refresh in a moment...');
  });

  req.pipe(proxyReq, { end: true });
});

// Wait 1.5 seconds for Next.js to initialize, then listen on 3000
setTimeout(() => {
  proxy.listen(3000, () => {
    console.log('Proxy listening on port 3000 -> forwarding to port 3001');
    console.log('BOTH http://localhost:3000 and http://localhost:3001 are now active!');
  });
}, 1500);

process.on('SIGINT', () => {
  nextProcess.kill();
  proxy.close();
  process.exit();
});
