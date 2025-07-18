#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Platform detection
const platform = process.platform;
const arch = process.arch;

// Map Node.js platform/arch to Rust target triples
const platformMap = {
  'darwin-arm64': 'aarch64-apple-darwin',
  'darwin-x64': 'x86_64-apple-darwin',
  'linux-x64': 'x86_64-unknown-linux-gnu',
  'linux-arm64': 'aarch64-unknown-linux-gnu',
  'win32-x64': 'x86_64-pc-windows-msvc',
  'win32-arm64': 'aarch64-pc-windows-msvc'
};

const platformKey = `${platform}-${arch}`;
const targetTriple = platformMap[platformKey];

console.log(`📦 Installing isal-node for ${platform}-${arch}`);

// Check if we have a pre-built binary
const prebuildPackage = `isal-node-${targetTriple}`;
const prebuildPath = path.join(__dirname, 'node_modules', prebuildPackage, 'index.node');

if (fs.existsSync(prebuildPath)) {
  console.log(`✅ Found pre-built binary for ${targetTriple}`);
  
  // Copy pre-built binary to main location
  const targetPath = path.join(__dirname, 'index.node');
  fs.copyFileSync(prebuildPath, targetPath);
  
  console.log(`📁 Copied binary to ${targetPath}`);
  console.log(`🎉 Installation complete! No compilation needed.`);
} else {
  console.log(`⚠️  No pre-built binary found for ${targetTriple}`);
  console.log(`🔧 Falling back to building from source...`);
  
  // Check if we have Rust installed
  try {
    execSync('rustc --version', { stdio: 'ignore' });
    console.log(`✅ Rust toolchain found`);
  } catch (error) {
    console.error(`❌ Rust toolchain not found!`);
    console.error(`
📥 To install Rust, run:
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh

🔄 Then restart your terminal and try again.
`);
    process.exit(1);
  }
  
  // Build from source
  try {
    console.log(`🔨 Building native module...`);
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`🎉 Build complete!`);
  } catch (error) {
    console.error(`❌ Build failed:`, error.message);
    process.exit(1);
  }
}

// Verify the binary works
try {
  const testPath = path.join(__dirname, 'index.node');
  if (fs.existsSync(testPath)) {
    console.log(`✅ Binary verification successful`);
  } else {
    throw new Error('Binary not found after installation');
  }
} catch (error) {
  console.error(`❌ Binary verification failed:`, error.message);
  process.exit(1);
}