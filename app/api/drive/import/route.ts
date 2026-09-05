import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { ANIMALS } from '@/lib/site-config';

const ASSETS_DIR = path.resolve('assets/product-photos');
const OUTPUT_DIR = path.resolve('public/images');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to find matching product slug based on filename
function matchSlug(fileName: string): string {
  const cleanName = fileName.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[_\s]+/g, '-');
  
  // Exact slug match
  const exact = ANIMALS.find((a) => a.slug === cleanName);
  if (exact) return exact.slug;

  // Fuzzy match on animal name or keywords
  for (const animal of ANIMALS) {
    const slugParts = animal.slug.split('-');
    const matches = slugParts.filter((part) => cleanName.includes(part));
    if (matches.length >= 2 || cleanName.includes(animal.slug)) {
      return animal.slug;
    }
  }

  // Fallback to sanitized file name
  return cleanName.replace(/[^a-z0-9-]/g, '');
}

async function processImageBuffer(buffer: Buffer, baseSlug: string) {
  const origMetadata = await sharp(buffer).metadata();
  const origWidth = origMetadata.width || 1200;
  const origHeight = origMetadata.height || 900;

  // 1. Trim uniform background border (guard: keep only if neither dimension collapses below ~12% of original)
  let pipeline = sharp(buffer);
  try {
    const trimmed = await sharp(buffer).trim().toBuffer({ resolveWithObject: true });
    if (
      trimmed.info.width >= origWidth * 0.12 &&
      trimmed.info.height >= origHeight * 0.12
    ) {
      pipeline = sharp(trimmed.data);
    }
  } catch {
    // Continue with original pipeline if trim is not applicable
  }

  // 2. Scale to fill ~90% of a WHITE 4:3 1600x1200 canvas
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

  // 3. Sharpen only when upscaling
  const scaleRatio = Math.max(
    resizedBuffer.info.width / origWidth,
    resizedBuffer.info.height / origHeight
  );
  if (scaleRatio > 1.1) {
    compositePipeline = compositePipeline.sharpen({ sigma: 1 });
  }

  const finalPng = await compositePipeline.png().toBuffer();

  // 4. Adaptive quality under 150KB for WebP
  let webpQuality = 84;
  let chosenWebp = await sharp(finalPng).webp({ quality: webpQuality, effort: 3 }).toBuffer();
  if (chosenWebp.length > 150 * 1024) {
    chosenWebp = await sharp(finalPng).webp({ quality: 65, effort: 3 }).toBuffer();
  }
  const webpPath = path.join(OUTPUT_DIR, `${baseSlug}.webp`);
  fs.writeFileSync(webpPath, chosenWebp);

  // 5. Adaptive quality under 150KB for AVIF
  let avifQuality = 55;
  let chosenAvif = await sharp(finalPng).avif({ quality: avifQuality, effort: 2 }).toBuffer();
  if (chosenAvif.length > 150 * 1024) {
    chosenAvif = await sharp(finalPng).avif({ quality: 45, effort: 2 }).toBuffer();
  }
  const avifPath = path.join(OUTPUT_DIR, `${baseSlug}.avif`);
  fs.writeFileSync(avifPath, chosenAvif);

  return {
    slug: baseSlug,
    webpSize: chosenWebp.length,
    avifSize: chosenAvif.length,
    url: `/images/${baseSlug}.webp`,
  };
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, folderId } = body;

    let filesToProcess: { id: string; name: string; targetSlug?: string }[] = items || [];

    // If no specific items passed but folderId is provided, fetch all image files in that folder
    if (filesToProcess.length === 0 && folderId) {
      const q = `'${folderId.replace(/'/g, "\\'")}' in parents and trashed = false and (mimeType contains 'image/' or mimeType = 'application/octet-stream')`;
      const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&pageSize=100`;
      const listRes = await fetch(driveUrl, { headers: { Authorization: authHeader } });
      if (listRes.ok) {
        const listData = await listRes.json();
        filesToProcess = listData.files || [];
      }
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: 'No files to import. Please specify items or a valid folder.' }, { status: 400 });
    }

    const results = [];

    for (const file of filesToProcess) {
      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      const downloadRes = await fetch(downloadUrl, {
        headers: { Authorization: authHeader },
      });

      if (!downloadRes.ok) {
        results.push({ id: file.id, name: file.name, error: `Failed to download: HTTP ${downloadRes.status}` });
        continue;
      }

      const arrayBuffer = await downloadRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save raw file in assets/product-photos
      const targetSlug = file.targetSlug || matchSlug(file.name);
      const rawExt = path.extname(file.name) || '.jpg';
      const rawPath = path.join(ASSETS_DIR, `${targetSlug}${rawExt}`);
      fs.writeFileSync(rawPath, buffer);

      // Process image using WebForge Sharp pipeline (White 4:3 1600x1200 WebP + AVIF)
      const processed = await processImageBuffer(buffer, targetSlug);
      results.push({
        id: file.id,
        name: file.name,
        slug: targetSlug,
        url: processed.url,
        webpSizeKb: Math.round(processed.webpSize / 1024),
        avifSizeKb: Math.round(processed.avifSize / 1024),
        status: 'success',
      });
    }

    return NextResponse.json({
      success: true,
      processedCount: results.filter((r) => r.status === 'success').length,
      results,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message || 'Import processing failed' }, { status: 500 });
  }
}
