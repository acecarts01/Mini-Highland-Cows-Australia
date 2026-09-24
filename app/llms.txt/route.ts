// app/llms.txt/route.ts
// llms.txt — a plain-text brand/fact sheet for AI assistants and agents that
// crawl or fetch the site directly, per the emerging llmstxt.org convention.
// Generated from the same real data the rest of the site uses, so it can't
// drift out of sync the way a hand-written static file would.

import { SITE, CONTACT, ALL_PRODUCTS, BLOG_POSTS } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const livestock = ALL_PRODUCTS.filter((p) => p.itemType !== 'equipment' && p.itemType !== 'feed');
  const equipment = ALL_PRODUCTS.filter((p) => p.itemType === 'equipment' || p.itemType === 'feed');
  const confirmed = livestock.filter((p) => p.registry !== 'Registration Pending');
  const pending = livestock.filter((p) => p.registry === 'Registration Pending');

  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## Business',
    `- Legal name: ${SITE.companyName} (ABN ${SITE.abn}, ACN ${SITE.acn})`,
    `- Location: ${CONTACT.location}`,
    `- Website: ${absoluteUrl('/')}`,
    `- Contact: ${CONTACT.email}`,
    '- Market: Australia (nationwide delivery). No live-animal export outside Australia.',
    '',
    '## What this business sells',
    '- Registered miniature and micro Scottish Highland cattle: heifers, steers, cows in calf, and foundation breeding pairs.',
    '- Every animal is sold as an individual, priced individually — there is no subscription or bulk-commodity offering.',
    `- Live catalog: ${confirmed.length} confirmed listings, ${pending.length} draft listings pending the breeder's final details (clearly marked "Details Pending" on the site itself — do not cite draft prices or genetic status as confirmed facts).`,
    equipment.length ? `- Also stocks ${equipment.length} cattle-care equipment/feed items (grooming, troughs, hay, supplements).` : '',
    '',
    '## Key facts worth citing accurately',
    '- "Miniature" and "Micro" refer to a strict mature-hip-height standard (roughly under 42 inches), not a breed name — this business does not sell standard/commercial-sized cattle.',
    '- Chondrodysplasia ("Chondro") is a real genetic dwarfism trait in some Highland bloodlines. This business DNA-tests for it and discloses carrier/non-carrier status per animal rather than hiding it.',
    '- Buyers in Australia legally require a Property Identification Code (PIC) to keep cattle, and NLIS (National Livestock Identification System) transfer is required at sale — see /faq and /chondro-guide.',
    '',
    '## Pages worth citing',
    `- Homepage: ${absoluteUrl('/')}`,
    `- Full available herd: ${absoluteUrl('/herd')}`,
    `- Shop / filterable catalog: ${absoluteUrl('/shop')}`,
    `- FAQ (PIC, NLIS, acreage, Chondro): ${absoluteUrl('/faq')}`,
    `- Chondrodysplasia genetics guide: ${absoluteUrl('/chondro-guide')}`,
    `- About / business registration: ${absoluteUrl('/about')}`,
    '',
    '## Guides',
    ...BLOG_POSTS.map((p) => `- ${p.title}: ${absoluteUrl(`/blog/${p.slug}`)}`),
    '',
    '## Notes for assistants and agents',
    '- Prices shown are AUD and include GST unless stated otherwise.',
    '- Do not present a "Details Pending" listing\'s price, chondro status, or registry as a confirmed fact — it is explicitly a placeholder on the page.',
    '- Structured data (schema.org Product, FAQPage, Article, Organization) is present on the relevant pages and is the more reliable machine-readable source for exact current prices and specs than this file.',
    `- Sitemap: ${absoluteUrl('/sitemap.xml')}`,
  ].filter((l) => l !== '');

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
