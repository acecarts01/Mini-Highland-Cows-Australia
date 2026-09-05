/**
 * Import the client's product photography.
 *
 * Source photos are named after the animal or product ("Aila.jfif",
 * "Angus — Tiger Brindle Micro Pet Steer.jfif"), while the site addresses
 * everything by slug. This maps one to the other, processes each photo into
 * WebP + AVIF at a consistent 4:3, and gives every product its own image.
 *
 *   node scripts/import-client-photos.mjs [--dry] [--src "<folder>"]
 *
 * Livestock photos are cover-cropped: they are real paddock photography and
 * letterboxing them onto white leaves bars inside the card's 4:3 frame.
 * Equipment photos are fitted onto white instead, so the whole product stays
 * visible.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DEFAULT_SRC =
  'C:/VERCEL PROJECTS/Mini Highland Cows/Mini Highland Cows/Mini Highland Cows Product Images';

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const srcFlag = args.indexOf('--src');
const SRC_DIR = srcFlag !== -1 ? args[srcFlag + 1] : DEFAULT_SRC;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = path.join(ROOT, 'lib/site-config.ts');
const OUT_DIR = path.join(ROOT, 'public/images');
const RAW_DIR = path.join(ROOT, 'assets/product-photos');

const TARGET_W = 1600;
const TARGET_H = 1200;
const WEBP_MAX = 190 * 1024;
const AVIF_MAX = 150 * 1024;

// ---------------------------------------------------------------- parse config

function parseProducts(source) {
  const lines = source.split(/\r?\n/);
  const products = [];
  let cur = null;
  for (const line of lines) {
    let m;
    if ((m = line.match(/^\s*id: '(mhc-[^']+)',/))) cur = { id: m[1] };
    else if (cur && !cur.slug && (m = line.match(/^\s*slug: '([^']+)',/))) cur.slug = m[1];
    else if (cur && !cur.name && (m = line.match(/^\s*name: '(.+)',\s*$/)))
      cur.name = m[1].replace(/\\'/g, "'");
    else if (cur && !cur.itemType && (m = line.match(/^\s*itemType: '([^']+)',/))) cur.itemType = m[1];
    else if (cur && (m = line.match(/^\s*image: '([^']+)',/))) {
      cur.image = m[1];
      products.push(cur);
      cur = null;
    }
  }
  return products;
}

// ---------------------------------------------------------------- name matching

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[\u2014\u2013\u2012-]/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const tokens = (s) => new Set(norm(s).split(' ').filter(Boolean));

function jaccard(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

function matchFile(productName, candidates) {
  const target = norm(productName);
  let best = null;
  for (const c of candidates) {
    let score;
    // "Angus — Tiger Brindle Micro Pet Steer" should match the product "Angus"
    if (c.head === target || c.full === target) score = 1;
    else if (c.full.startsWith(`${target} `)) score = 0.95;
    else score = Math.max(jaccard(c.full, target), jaccard(c.head, target));
    if (!best || score > best.score) best = { ...c, score };
  }
  return best;
}

// ---------------------------------------------------------------- processing

async function encode(pipelineBuffer, slug) {
  let webp = await sharp(pipelineBuffer).webp({ quality: 86, effort: 4 }).toBuffer();
  if (webp.length > WEBP_MAX) {
    webp = await sharp(pipelineBuffer).webp({ quality: 72, effort: 4 }).toBuffer();
  }

  let avif = await sharp(pipelineBuffer).avif({ quality: 58, effort: 3 }).toBuffer();
  if (avif.length > AVIF_MAX) {
    avif = await sharp(pipelineBuffer).avif({ quality: 45, effort: 3 }).toBuffer();
  }

  if (!DRY) {
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.webp`), webp);
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.avif`), avif);
  }
  return { webp: webp.length, avif: avif.length };
}

async function processPhoto(srcPath, slug, isLivestock) {
  const input = fs.readFileSync(srcPath);

  let canvas;
  if (isLivestock) {
    // Real photography: crop to fill the 4:3 frame, biased to the subject.
    canvas = await sharp(input)
      .rotate()
      .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'attention', kernel: 'lanczos3' })
      .toBuffer();
  } else {
    // Product shots: keep the whole item, centred on white.
    const inner = await sharp(input)
      .rotate()
      .resize(Math.round(TARGET_W * 0.88), Math.round(TARGET_H * 0.88), {
        fit: 'inside',
        kernel: 'lanczos3',
        withoutEnlargement: false,
      })
      .toBuffer();

    canvas = await sharp({
      create: {
        width: TARGET_W,
        height: TARGET_H,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: inner, gravity: 'center' }])
      .png()
      .toBuffer();
  }

  return encode(canvas, slug);
}

// ---------------------------------------------------------------- main

const configSource = fs.readFileSync(CONFIG, 'utf8');
const products = parseProducts(configSource);

const files = fs
  .readdirSync(SRC_DIR)
  .filter((f) => /\.(jpe?g|jfif|png|webp|avif|tiff?)$/i.test(f))
  .map((f) => {
    const base = f.replace(/\.[^.]+$/, '');
    return {
      file: f,
      full: norm(base),
      head: norm(base.split(/\s*[\u2014\u2013]\s*/)[0]),
    };
  });

if (!DRY) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

const results = [];
const unmatched = [];

for (const product of products) {
  const best = matchFile(product.name, files);
  if (!best || best.score < 0.6) {
    unmatched.push({ product, best });
    continue;
  }

  const isLivestock = product.itemType !== 'equipment' && product.itemType !== 'feed';
  const srcPath = path.join(SRC_DIR, best.file);

  const sizes = DRY ? { webp: 0, avif: 0 } : await processPhoto(srcPath, product.slug, isLivestock);

  if (!DRY) {
    // Keep the original alongside the derived assets. Drop any previous
    // original for this slug first — otherwise re-importing a photo in a
    // different format leaves two sources for one product and the stale one
    // is indistinguishable from the live one later.
    for (const existing of fs.readdirSync(RAW_DIR)) {
      if (existing.replace(/\.[^.]+$/, '') === product.slug) {
        fs.rmSync(path.join(RAW_DIR, existing));
      }
    }
    const ext = path.extname(best.file).toLowerCase() === '.jfif' ? '.jpg' : path.extname(best.file);
    fs.copyFileSync(srcPath, path.join(RAW_DIR, `${product.slug}${ext}`));
  }

  results.push({ ...product, source: best.file, score: best.score, isLivestock, sizes });
  console.log(
    `  ${product.slug.padEnd(52)} <- ${best.file.slice(0, 46).padEnd(48)}` +
      (DRY ? '' : ` webp ${Math.round(sizes.webp / 1024)}kb  avif ${Math.round(sizes.avif / 1024)}kb`)
  );
}

// ---------------------------------------------------------------- rewrite config

if (!DRY) {
  const lines = configSource.split(/\r?\n/);
  const bySlug = new Map(results.map((r) => [r.slug, r]));
  let currentSlug = null;
  let rewritten = 0;

  const out = lines.map((line) => {
    const slugMatch = line.match(/^\s*slug: '([^']+)',/);
    if (slugMatch) currentSlug = slugMatch[1];

    const imageMatch = line.match(/^(\s*)image: '[^']+',$/);
    if (imageMatch && currentSlug && bySlug.has(currentSlug)) {
      rewritten++;
      return `${imageMatch[1]}image: '/images/${currentSlug}.webp',`;
    }
    return line;
  });

  fs.writeFileSync(CONFIG, out.join('\n'));
  console.log(`\nsite-config.ts: rewrote ${rewritten} image paths`);
}

console.log(`\nmatched ${results.length}/${products.length} products`);
if (unmatched.length) {
  console.log('UNMATCHED:');
  for (const u of unmatched) {
    console.log(`  ${u.product.name} (best: ${u.best?.file ?? 'none'} @ ${u.best?.score.toFixed(2)})`);
  }
  process.exitCode = 1;
}
