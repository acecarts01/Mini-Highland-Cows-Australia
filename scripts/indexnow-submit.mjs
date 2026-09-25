// scripts/indexnow-submit.mjs
//
// Submits every URL in the live sitemap to the IndexNow API in one batch.
// Bing (and the other IndexNow-participating engines: Yandex, Seznam.cz,
// Naver) picks these up for priority crawl, typically within hours rather
// than waiting on the normal crawl schedule. The verification key file
// lives at public/<key>.txt - it must match INDEXNOW_KEY exactly, and
// both are already committed together so they never drift apart.
//
// Usage: node scripts/indexnow-submit.mjs [url1 url2 ...]
// With no args, submits every <loc> found in the live sitemap.xml.

const SITE = 'https://www.minihighlandcow.com.au';
const INDEXNOW_KEY = '718e691ad64ee4e2a98a39bd544b0d2d';

async function getSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const argUrls = process.argv.slice(2);
  const urlList = argUrls.length ? argUrls : await getSitemapUrls();

  console.log(`Submitting ${urlList.length} URL(s) to IndexNow...`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(body);
    process.exit(1);
  }
}

main();
