#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Build the Rust library
console.log('Building Rust library...');
execSync('cargo build --release', { stdio: 'inherit' });

// Determine the correct library extension and path
const platform = os.platform();
let libExtension, libPrefix;

if (platform === 'win32') {
    libExtension = '.dll';
    libPrefix = '';
} else if (platform === 'darwin') {
    libExtension = '.dylib';
    libPrefix = 'lib';
} else {
    libExtension = '.so';
    libPrefix = 'lib';
}

const libName = `${libPrefix}isal_node${libExtension}`;
const sourcePath = path.join('target', 'release', libName);
const targetPath = 'index.node';

// Copy the library to the expected location
console.log(`Copying ${sourcePath} to ${targetPath}...`);
fs.copyFileSync(sourcePath, targetPath);

console.log('Build complete!');