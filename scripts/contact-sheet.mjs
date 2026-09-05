/**
 * Regenerate the product-photo contact sheets from what is actually live in
 * public/images, labelled by product name. Run after importing photos so the
 * sheet never drifts from the site.
 *
 *   node scripts/contact-sheet.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = path.join(ROOT, 'public/images');
const DOCS = path.join(ROOT, 'docs');

const COLS = 5;
const IMG_W = 300;
const IMG_H = 225;
const LABEL_H = 34;
const CELL_H = IMG_H + LABEL_H;

function parseProducts() {
  const lines = fs.readFileSync(path.join(ROOT, 'lib/site-config.ts'), 'utf8').split(/\r?\n/);
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

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function sheet(items, outFile) {
  const rows = Math.ceil(items.length / COLS);
  const composites = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const file = path.join(IMAGES, path.basename(item.image));
    if (!fs.existsSync(file)) {
      console.warn(`  missing: ${item.image} (${item.name})`);
      continue;
    }
    const x = (i % COLS) * IMG_W;
    const y = Math.floor(i / COLS) * CELL_H;

    composites.push({
      input: await sharp(file).resize(IMG_W, IMG_H, { fit: 'cover' }).png().toBuffer(),
      left: x,
      top: y,
    });

    const label = item.name.length > 34 ? `${item.name.slice(0, 33)}…` : item.name;
    composites.push({
      input: Buffer.from(
        `<svg width="${IMG_W}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
           <rect width="100%" height="100%" fill="#232320"/>
           <text x="8" y="22" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#e5c07b">${esc(label)}</text>
         </svg>`
      ),
      left: x,
      top: y + IMG_H,
    });
  }

  await sharp({
    create: {
      width: COLS * IMG_W,
      height: rows * CELL_H,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outFile);

  console.log(`wrote ${path.relative(ROOT, outFile)} (${items.length} items)`);
}

const products = parseProducts();
const livestock = products.filter((p) => p.itemType !== 'equipment' && p.itemType !== 'feed');
const gear = products.filter((p) => p.itemType === 'equipment' || p.itemType === 'feed');

fs.mkdirSync(DOCS, { recursive: true });
await sheet(livestock, path.join(DOCS, 'contact-sheet-livestock.png'));
await sheet(gear, path.join(DOCS, 'contact-sheet-equipment.png'));
