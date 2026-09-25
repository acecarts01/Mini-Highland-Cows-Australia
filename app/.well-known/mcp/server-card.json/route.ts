// MCP Server Card (SEP-1649). Honest declaration: no live /api/mcp
// endpoint exists on this site yet, so this declares "transport: none"
// with a human_ordering_only note rather than claiming live tools it
// can't actually serve (Rule 10 — never claim a capability the site
// doesn't have). If a real MCP server is built later, this file (and
// its resolved endpoint) should be updated together.

import { SITE, CONTACT } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    $schema: 'https://modelcontextprotocol.io/schemas/server-card/v1.json',
    serverInfo: {
      name: SITE.name,
      version: '1.0.0',
      description: SITE.description,
      homepage: absoluteUrl('/'),
      contact: { email: CONTACT.email },
    },
    transport: {
      type: 'none',
      note: 'No live MCP endpoint is deployed. This card declares discoverable HTML resources only, per RFC-9727 companion api-catalog.',
    },
    capabilities: {
      resources: [
        { name: 'catalog', description: 'Full product catalog (HTML)', uri: absoluteUrl('/shop') },
        { name: 'available-herd', description: 'Live availability list (HTML)', uri: absoluteUrl('/herd') },
        { name: 'faq', description: 'Buyer FAQ (HTML)', uri: absoluteUrl('/faq') },
      ],
      commerce: {
        ordering: 'human_ordering_only',
        payment: ['bank-transfer', 'crypto-BTC', 'crypto-USDT'],
        currency: SITE.currency,
        note: `Orders are placed by a human on ${absoluteUrl('/order-now')}. There is no agent-callable order-placement endpoint.`,
      },
    },
    legal: {
      ageRestriction: 'none',
      productType: 'live-animals-and-agricultural-equipment',
      compliance: 'Australian biosecurity law (PIC/NLIS) applies to every live-animal transaction — see /faq.',
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
