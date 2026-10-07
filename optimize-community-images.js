const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const input = path.join(__dirname, 'assets', 'community');
const root = path.join(__dirname, 'assets', 'community-optimized');
const thumbs = path.join(root, 'thumbs');
const full = path.join(root, 'full');
fs.mkdirSync(thumbs, { recursive: true });
fs.mkdirSync(full, { recursive: true });
if (!fs.existsSync(input)) throw new Error('Missing assets/community folder');
const files = fs.readdirSync(input).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
async function run() {
  const manifest = [];
  for (const [i, file] of files.entries()) {
    // Extension in filename prevents collisions between e.g. photo.jpg and photo.png.
    const base = `${file}.webp`;
    const source = path.join(input, file);
    const thumbPath = path.join(thumbs, base);
    const fullPath = path.join(full, base);
    const sourceTime = fs.statSync(source).mtimeMs;
    if (!fs.existsSync(thumbPath) || fs.statSync(thumbPath).mtimeMs < sourceTime) {
      await sharp(source).rotate().resize({ width: 420, height: 320, fit: 'cover', withoutEnlargement: true }).webp({ quality: 70, effort: 4 }).toFile(thumbPath);
    }
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).mtimeMs < sourceTime) {
      await sharp(source).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(fullPath);
    }
    manifest.push({
      thumb: 'assets/community-optimized/thumbs/' + encodeURIComponent(base),
      full: 'assets/community-optimized/full/' + encodeURIComponent(base)
    });
    console.log(`${i + 1}/${files.length} ${file}`);
  }
  fs.writeFileSync(path.join(__dirname, 'community-images.js'), 'window.communityImages = ' + JSON.stringify(manifest, null, 2) + ';\n');
  console.log(`Generated ${manifest.length} gallery entries.`);
}
run().catch(e => { console.error(e); process.exitCode = 1; });
