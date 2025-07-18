#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get version from package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

console.log(`🚀 Preparing release v${version}`);

// Update optionalDependencies to match current version
packageJson.optionalDependencies = packageJson.optionalDependencies || {};
Object.keys(packageJson.optionalDependencies).forEach(dep => {
  packageJson.optionalDependencies[dep] = version;
});

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('✅ Updated optionalDependencies versions');

// Run tests
console.log('🧪 Running tests...');
try {
  execSync('npm run test:all', { stdio: 'inherit' });
  console.log('✅ All tests passed');
} catch (error) {
  console.error('❌ Tests failed');
  process.exit(1);
}

// Create git tag
console.log(`🏷️  Creating git tag v${version}`);
try {
  execSync(`git add package.json`);
  execSync(`git commit -m "chore: bump version to ${version}"`);
  execSync(`git tag v${version}`);
  console.log('✅ Git tag created');
} catch (error) {
  console.error('❌ Git operations failed:', error.message);
  process.exit(1);
}

console.log(`
🎉 Release v${version} prepared!

Next steps:
1. Push to GitHub: git push origin main --tags
2. GitHub Actions will automatically build and publish binaries
3. Monitor the build at: https://github.com/your-username/isal-node/actions

The release process will:
• Build binaries for all supported platforms
• Publish platform-specific packages (@isal-node/*)
• Publish the main package with optionalDependencies
`);

console.log('🔗 Useful commands:');
console.log('  git log --oneline -5  # View recent commits');
console.log('  git tag -l            # List all tags');
console.log('  git push origin main --tags  # Push everything to GitHub');