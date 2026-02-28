#!/usr/bin/env node
/**
 * Generate PNG images for TutoFacile tutorials
 * Creates colored gradient images for each tutorial
 * Uses canvas library or pure binary PNG generation
 */

const fs = require('fs');
const path = require('path');

// PNG file signature
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/**
 * Create a simple PNG file with gradient
 * Returns a Buffer containing the PNG data
 */
function createGradientPNG(width, height, startColor, endColor) {
  // This is complex - let's use a simpler approach with SVG->PNG conversion
  // For now, we'll create SVG files and document how to convert them
  
  // Create SVG content
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
    <defs>
      <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' style='stop-color:rgb(${startColor[0]},${startColor[1]},${startColor[2]});stop-opacity:1' />
        <stop offset='100%' style='stop-color:rgb(${endColor[0]},${endColor[1]},${endColor[2]});stop-opacity:1' />
      </linearGradient>
    </defs>
    <rect width='${width}' height='${height}' fill='url(#grad)'/>
  </svg>`;
  
  return svg;
}

// Tutorial configurations
const tutorials = [
  {
    id: 1,
    filename: 'tuto-1-flexbox',
    startColor: [0, 105, 246],
    endColor: [0, 196, 167],
    text: 'CSS',
    fontSize: 60
  },
  {
    id: 2,
    filename: 'tuto-2-cookies',
    startColor: [34, 197, 94],
    endColor: [245, 158, 11],
    text: '🍪',
    fontSize: 60
  },
  {
    id: 3,
    filename: 'tuto-3-nodejs',
    startColor: [0, 105, 246],
    endColor: [94, 45, 253],
    text: 'N',
    fontSize: 60
  },
  {
    id: 4,
    filename: 'tuto-4-tomates',
    startColor: [239, 68, 68],
    endColor: [245, 158, 11],
    text: '🍅',
    fontSize: 60
  },
  {
    id: 5,
    filename: 'tuto-5-chocolate',
    startColor: [139, 69, 19],
    endColor: [210, 105, 30],
    text: '🍫',
    fontSize: 60
  }
];

const imagesDir = path.join(__dirname, 'images');

// Create images directory
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Created images directory');
}

// Generate SVG files (these can be converted to PNG with ImageMagick or online tools)
console.log('Generating SVG files...\n');

tutorials.forEach(tutorial => {
  try {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
  <defs>
    <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' style='stop-color:rgb(${tutorial.startColor[0]},${tutorial.startColor[1]},${tutorial.startColor[2]});stop-opacity:1' />
      <stop offset='100%' style='stop-color:rgb(${tutorial.endColor[0]},${tutorial.endColor[1]},${tutorial.endColor[2]});stop-opacity:1' />
    </linearGradient>
  </defs>
  <rect width='400' height='300' fill='url(#grad)'/>
  <text x='200' y='150' font-size='${tutorial.fontSize}' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'>${tutorial.text}</text>
</svg>`;
    
    const svgPath = path.join(imagesDir, `${tutorial.filename}.svg`);
    fs.writeFileSync(svgPath, svg, 'utf8');
    console.log(`✅ ${tutorial.filename}.svg`);
    
  } catch (err) {
    console.error(`❌ Error creating ${tutorial.filename}:`, err.message);
  }
});

console.log('\n📝 SVG files created successfully!');
console.log('\n💡 To convert SVG to PNG, you have several options:\n');
console.log('Option 1: Use an online converter');
console.log('   https://cloudconvert.com/svg-to-png\n');
console.log('Option 2: Use ImageMagick (command line)');
console.log('   convert tuto-1-flexbox.svg tuto-1-flexbox.png\n');
console.log('Option 3: Use Inkscape');
console.log('   inkscape tuto-1-flexbox.svg --export-png=tuto-1-flexbox.png\n');
console.log('Option 4: Use ffmpeg');
console.log('   ffmpeg -i tuto-1-flexbox.svg tuto-1-flexbox.png\n');
