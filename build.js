const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Build client
console.log('Building client...');
execSync('cd client && npm run build', { stdio: 'inherit' });

// Copy client build to dist
console.log('Copying client build to dist...');
fs.cpSync('client/dist', 'dist/client', { recursive: true });

// Build server
console.log('Building server...');
execSync('cd server && npm run build', { stdio: 'inherit' });

// Copy server build to dist
console.log('Copying server build to dist...');
fs.cpSync('server/dist', 'dist/server', { recursive: true });

// Copy shared directory
console.log('Copying shared directory...');
fs.cpSync('shared', 'dist/shared', { recursive: true });

console.log('Build completed successfully!'); 