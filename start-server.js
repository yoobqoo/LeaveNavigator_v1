const { spawn } = require('child_process');
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  detached: true
});
server.unref();
console.log('Server started with PID:', server.pid);
