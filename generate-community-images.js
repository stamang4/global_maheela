const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'assets', 'community-optimized');
const thumbs = path.join(root, 'thumbs');
const full = path.join(root, 'full');
if (!fs.existsSync(thumbs) || !fs.existsSync(full)) {
  console.error('Run node optimize-community-images.js first.');
  process.exit(1);
}
const images = fs.readdirSync(thumbs).filter(f => f.endsWith('.webp') && fs.existsSync(path.join(full, f))).sort().map(f => ({
  thumb: 'assets/community-optimized/thumbs/' + encodeURIComponent(f),
  full: 'assets/community-optimized/full/' + encodeURIComponent(f)
}));
fs.writeFileSync(path.join(__dirname, 'community-images.js'), 'window.communityImages = ' + JSON.stringify(images, null, 2) + ';\n');
console.log(`Generated ${images.length} gallery entries.`);
