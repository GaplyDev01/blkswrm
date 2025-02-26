// This file confirms Next.js is installed
const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

console.log('Next.js version:', packageJson.dependencies.next);
console.log('React version:', packageJson.dependencies.react);
console.log('React DOM version:', packageJson.dependencies['react-dom']);

// Check if the project is a valid Next.js project
const hasNextConfig = fs.existsSync(path.join(__dirname, 'next.config.js'));
const hasSrcDir = fs.existsSync(path.join(__dirname, 'src'));
const hasAppDir = fs.existsSync(path.join(__dirname, 'src/app'));

console.log('Has next.config.js:', hasNextConfig);
console.log('Has src directory:', hasSrcDir);
console.log('Has app directory:', hasAppDir);

console.log('Project is a valid Next.js project:', hasNextConfig && hasSrcDir && hasAppDir);