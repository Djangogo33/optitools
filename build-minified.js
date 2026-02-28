// TUTOFACILE 2.1 - MINIFIED VERSION BUILDER
// This script creates minified versions of all modules

const fs = require('fs');
const path = require('path');

// List of files to minify
const files = [
  'config-system.js',
  'init.js',
  'advanced-search.js',
  'analytics-engine.js',
  'recommendation-engine.js',
  'notification-manager.js',
  'gamification-engine.js',
  'dark-mode-toggle.js',
  'language-selector.js',
  'pdf-export.js',
  'social-sharing.js',
  'script.js'
];

// Simple minification function
function minify(code) {
  return code
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    // Remove whitespace
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:])\s*/g, '$1')
    // Remove line breaks
    .trim();
}

// Process each file
files.forEach(file => {
  const filepath = path.join(__dirname, file);
  if (fs.existsSync(filepath)) {
    const code = fs.readFileSync(filepath, 'utf8');
    const minified = minify(code);
    const minPath = filepath.replace('.js', '.min.js');
    fs.writeFileSync(minPath, minified);
    
    const originalSize = Buffer.byteLength(code, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const savings = Math.round((1 - minifiedSize / originalSize) * 100);
    
    console.log(`✅ ${file}: ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`);
  }
});

console.log('\n📊 All files minified successfully!');
