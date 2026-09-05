import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('assets/product-photos');
const OUTPUT_DIR = path.resolve('public/images');
const DOCS_DIR = path.resolve('docs');

if (!fs.existsSync(SOURCE_DIR)) {
  fs.mkdirSync(SOURCE_DIR, { recursive: true });
}
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

async function processImage(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'].includes(ext)) return;

  const baseName = path.basename(file, ext);
  const inputPath = path.join(SOURCE_DIR, file);

  console.log(`Processing ${file}...`);

  try {
    const inputMetadata = await sharp(inputPath).metadata();
    const origWidth = inputMetadata.width || 1200;
    const origHeight = inputMetadata.height || 900;

    // 1. Trim uniform background border (guard: keep only if neither dimension collapses below ~12% of original)
    let pipeline = sharp(inputPath);
    try {
      const trimmed = await sharp(inputPath).trim().toBuffer({ resolveWithObject: true });
      if (
        trimmed.info.width >= origWidth * 0.12 &&
        trimmed.info.height >= origHeight * 0.12
      ) {
        pipeline = sharp(trimmed.data);
      }
    } catch {
      // If trim fails, continue with original
    }

    // 2. Scale to fill ~90% of a WHITE 4:3 1600x1200 canvas, enlarging small sources (kernel:'lanczos3', no withoutEnlargement)
    const targetW = 1600;
    const targetH = 1200;
    const innerW = Math.round(targetW * 0.9);
    const innerH = Math.round(targetH * 0.9);

    const resizedBuffer = await pipeline
      .resize(innerW, innerH, {
        fit: 'inside',
        kernel: 'lanczos3',
        withoutEnlargement: false,
      })
      .toBuffer({ resolveWithObject: true });

    let compositePipeline = sharp({
      create: {
        width: targetW,
        height: targetH,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    }).composite([
      {
        input: resizedBuffer.data,
        gravity: 'center',
      },
    ]);

    // 3. Sharpen only when upscaling (sigma:1 when fill scale > ~1.1)
    const scaleRatio = Math.max(
      resizedBuffer.info.width / origWidth,
      resizedBuffer.info.height / origHeight
    );
    if (scaleRatio > 1.1) {
      compositePipeline = compositePipeline.sharpen({ sigma: 1 });
    }

    const finalBuffer = await compositePipeline.png().toBuffer();

    // 4. Adaptive quality under 150KB: WebP and AVIF with fast effort
    let webpQuality = 84;
    let chosenWebp = await sharp(finalBuffer).webp({ quality: webpQuality, effort: 3 }).toBuffer();
    if (chosenWebp.length > 150 * 1024) {
      chosenWebp = await sharp(finalBuffer).webp({ quality: 65, effort: 3 }).toBuffer();
    }
    fs.writeFileSync(path.join(OUTPUT_DIR, `${baseName}.webp`), chosenWebp);

    let avifQuality = 55;
    let chosenAvif = await sharp(finalBuffer).avif({ quality: avifQuality, effort: 2 }).toBuffer();
    if (chosenAvif.length > 150 * 1024) {
      chosenAvif = await sharp(finalBuffer).avif({ quality: 45, effort: 2 }).toBuffer();
    }
    fs.writeFileSync(path.join(OUTPUT_DIR, `${baseName}.avif`), chosenAvif);

    console.log(`✓ Generated ${baseName}.webp (${Math.round(chosenWebp.length / 1024)}KB) and ${baseName}.avif (${Math.round(chosenAvif.length / 1024)}KB)`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}

async function generateContactSheet() {
  try {
    const webpFiles = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.webp') && !f.startsWith('_'));
    if (webpFiles.length === 0) return;

    const thumbWidth = 320;
    const thumbHeight = 240;
    const cols = 4;
    const rows = Math.ceil(webpFiles.length / cols);
    const sheetWidth = cols * thumbWidth;
    const sheetHeight = rows * thumbHeight;

    const composites = [];
    for (let i = 0; i < webpFiles.length; i++) {
      const file = webpFiles[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const thumbBuffer = await sharp(path.join(OUTPUT_DIR, file))
        .resize(thumbWidth, thumbHeight, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .toBuffer();
      composites.push({
        input: thumbBuffer,
        left: col * thumbWidth,
        top: row * thumbHeight,
      });
    }

    const sheet = await sharp({
      create: {
        width: sheetWidth,
        height: sheetHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite(composites)
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(DOCS_DIR, '_contact-sheet.png'), sheet);
    fs.writeFileSync(path.join(OUTPUT_DIR, '_contact-sheet.png'), sheet);
    console.log(`✓ Generated contact sheet with ${webpFiles.length} images at docs/_contact-sheet.png`);
  } catch (err) {
    console.error('Error creating contact sheet:', err);
  }
}

async function run() {
  const files = fs.readdirSync(SOURCE_DIR);
  if (files.length === 0) {
    console.log(`No images found in ${SOURCE_DIR}. Place source photos here and re-run.`);
    await generateContactSheet();
    return;
  }
  for (const file of files) {
    await processImage(file);
  }
  await generateContactSheet();
  console.log('Image processing pipeline finished successfully.');
}

run();
