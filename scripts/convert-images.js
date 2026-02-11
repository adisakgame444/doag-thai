#!/usr/bin/env node
// scripts/convert-images.js
// Usage: node scripts/convert-images.js [--src public/images] [--out public/images/optimized]
// Requires: npm i sharp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const argv = require('minimist')(process.argv.slice(2));
const SRC = argv.src || path.join(__dirname, '..', 'public', 'images');
const OUT = argv.out || path.join(__dirname, '..', 'public', 'images', 'optimized');
const SIZES = argv.sizes ? argv.sizes.split(',').map(Number) : [1920, 1280, 768, 480];
const QUALITY = Number(argv.q) || 50; // avif quality default

if (!fs.existsSync(SRC)) {
  console.error('Source folder not found:', SRC);
  process.exit(1);
}
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

async function convertFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;
  const base = path.basename(file, ext);
  const inPath = path.join(SRC, file);
  console.log('Converting', file);
  for (const w of SIZES) {
    const outAvif = path.join(OUT, `${base}@${w}.avif`);
    const outWebp = path.join(OUT, `${base}@${w}.webp`);
    try {
      await sharp(inPath).resize(w).avif({ quality: QUALITY }).toFile(outAvif);
      await sharp(inPath).resize(w).webp({ quality: Math.min(80, QUALITY + 20) }).toFile(outWebp);
      console.log('  ->', path.relative(process.cwd(), outAvif));
    } catch (err) {
      console.error('  failed for', file, err.message);
    }
  }
}

(async () => {
  const files = fs.readdirSync(SRC).filter(f => fs.statSync(path.join(SRC, f)).isFile());
  for (const f of files) {
    await convertFile(f);
  }
  console.log('Done. Optimized images written to', OUT);
})();
