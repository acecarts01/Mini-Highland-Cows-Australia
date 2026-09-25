// RFC 9727 API catalog (linkset) — declares the site's human-facing and
// machine-readable resources. No live JSON product API exists yet (see
// mcp/server-card.json's honest "transport: none" declaration), so this
// only lists real, currently-resolvable resources — never a capability
// the site doesn't have (Rule 10).

import { SITE } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    linkset: [
      {
        anchor: absoluteUrl('/'),
        'https://www.iana.org/assignments/link-relations/service-doc': [{ href: absoluteUrl('/faq') }],
        title: `${SITE.name} — ${SITE.tagline}`,
      },
      {
        anchor: absoluteUrl('/shop'),
        type: 'text/html',
        title: `${SITE.name} — Filterable Product Catalog`,
      },
      {
        anchor: absoluteUrl('/herd'),
        type: 'text/html',
        title: `${SITE.name} — Live Available Herd`,
      },
      {
        anchor: absoluteUrl('/sitemap.xml'),
        type: 'application/xml',
        title: 'Full sitemap',
      },
      {
        anchor: absoluteUrl('/llms.txt'),
        type: 'text/plain',
        title: 'LLM-readable brand and fact sheet',
      },
      {
        anchor: absoluteUrl('/.well-known/ai-catalog.json'),
        type: 'application/json',
        title: 'ARD (Agentic Resource Discovery) capability manifest',
      },
    ],
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/linkset+json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
