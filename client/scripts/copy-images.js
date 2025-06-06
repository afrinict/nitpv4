const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../../images');
const targetDir = path.join(__dirname, '../public/images');

// Ensure the target directory exists
fs.ensureDirSync(targetDir);

// Copy all files from source to target
fs.copySync(sourceDir, targetDir, { overwrite: true });

console.log('Images copied successfully!'); 