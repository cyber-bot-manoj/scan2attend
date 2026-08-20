const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Launching Smart Attendance System Servers...');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. Launch Node.js Backend Server
const server = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

server.on('error', (err) => console.error('Backend Error:', err));

// 2. Launch Vite Client
const client = spawn(npmCmd, ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, 'client')
});

client.on('error', (err) => console.error('Client Error:', err));

process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit();
});
