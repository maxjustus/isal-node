#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get target from environment or detect platform
const target = process.env.CARGO_BUILD_TARGET || detectTarget();

function detectTarget() {
  const platform = os.platform();
  const arch = os.arch();
  
  const platformMap = {
    'darwin-arm64': 'aarch64-apple-darwin',
    'darwin-x64': 'x86_64-apple-darwin',
    'linux-x64': 'x86_64-unknown-linux-gnu',
    'linux-arm64': 'aarch64-unknown-linux-gnu',
    'win32-x64': 'x86_64-pc-windows-msvc',
    'win32-arm64': 'aarch64-pc-windows-msvc'
  };
  
  return platformMap[`${platform}-${arch}`] || null;
}

// Build the Rust library
console.log(`Building Rust library for target: ${target || 'native'}`);

let cargoCommand = 'cargo build --release';
if (target) {
  cargoCommand += ` --target ${target}`;
}

try {
  execSync(cargoCommand, { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

// Determine the correct library extension and path
const platform = target ? target.split('-')[2] : os.platform();
let libExtension, libPrefix;

if (platform === 'windows' || platform === 'win32') {
    libExtension = '.dll';
    libPrefix = '';
} else if (platform === 'darwin' || platform === 'apple') {
    libExtension = '.dylib';
    libPrefix = 'lib';
} else {
    libExtension = '.so';
    libPrefix = 'lib';
}

const libName = `${libPrefix}isal_node${libExtension}`;
const targetSubdir = target ? path.join('target', target, 'release') : path.join('target', 'release');
const sourcePath = path.join(targetSubdir, libName);
const targetPath = 'index.node';

// Copy the library to the expected location
console.log(`Copying ${sourcePath} to ${targetPath}...`);
try {
  fs.copyFileSync(sourcePath, targetPath);
  console.log('Build complete!');
} catch (error) {
  console.error('Copy failed:', error.message);
  console.error('Available files:', fs.readdirSync(targetSubdir));
  process.exit(1);
}