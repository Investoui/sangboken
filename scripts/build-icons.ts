import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = join(process.cwd(), 'public');
const SVG_PATH = join(PUBLIC_DIR, 'icon.svg');

const SIZES = [192, 512];

async function buildIcons() {
  console.log('Building PWA icons from SVG...');

  const svgBuffer = readFileSync(SVG_PATH);

  for (const size of SIZES) {
    const outputPath = join(PUBLIC_DIR, `icon-${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`  Created icon-${size}.png`);
  }

  // Also create apple-touch-icon (180x180 is standard for iOS)
  const appleIconPath = join(PUBLIC_DIR, 'apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleIconPath);
  console.log('  Created apple-touch-icon.png');

  // Create favicon.ico (32x32)
  const faviconPath = join(PUBLIC_DIR, 'favicon.ico');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconPath);
  console.log('  Created favicon.ico (as PNG)');

  console.log('Done!');
}

buildIcons().catch(console.error);
