const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Testing installation system...');

// Test 1: Check if install.js exists
const installPath = path.join(__dirname, '..', 'install.js');
if (!fs.existsSync(installPath)) {
  console.error('❌ install.js not found');
  process.exit(1);
}
console.log('✅ install.js found');

// Test 2: Check if build.js exists
const buildPath = path.join(__dirname, '..', 'build.js');
if (!fs.existsSync(buildPath)) {
  console.error('❌ build.js not found');
  process.exit(1);
}
console.log('✅ build.js found');

// Test 3: Check if native binary exists
const binaryPath = path.join(__dirname, '..', 'index.node');
if (!fs.existsSync(binaryPath)) {
  console.error('❌ index.node not found');
  process.exit(1);
}
console.log('✅ index.node found');

// Test 4: Check if the binary can be required
try {
  const isal = require('../index');
  console.log('✅ Library can be required');
  
  // Test 5: Basic functionality
  const testData = Buffer.from('Hello, installation test!');
  const compressed = isal.gzip(testData);
  const decompressed = isal.gunzip(compressed);
  
  if (decompressed.equals(testData)) {
    console.log('✅ Basic compression/decompression works');
  } else {
    console.error('❌ Basic compression/decompression failed');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Library cannot be required:', error.message);
  process.exit(1);
}

console.log('🎉 Installation system test passed!');