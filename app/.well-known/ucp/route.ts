// Universal Commerce Protocol. The "ucp": "1.0" field is mandatory -
// scanners fail without it.

import { SITE } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    ucp: '1.0',
    protocol_version: '1.0',
    spec: 'https://ucp.dev/specification/overview/',
    schema: 'https://ucp.dev/schema/v1.json',
    site: absoluteUrl('/'),
    name: SITE.name,
    description: SITE.description,
    services: [
      { id: 'product-catalog', type: 'catalog', url: absoluteUrl('/shop'), description: 'Full product catalog' },
      { id: 'available-herd', type: 'catalog', url: absoluteUrl('/herd'), description: 'Live availability list' },
      { id: 'order', type: 'commerce', url: absoluteUrl('/order-now'), description: 'Human-completed order/reservation form' },
    ],
    capabilities: ['browse', 'search', 'content'],
    endpoints: {
      catalog: absoluteUrl('/shop'),
      contact: absoluteUrl('/contact'),
      agent_skills: absoluteUrl('/.well-known/agent-skills/index.json'),
      mcp_server_card: absoluteUrl('/.well-known/mcp/server-card.json'),
      api_catalog: absoluteUrl('/.well-known/api-catalog'),
      llms_txt: absoluteUrl('/llms.txt'),
    },
    currency: SITE.currency,
    payment_methods: ['bank-transfer', 'crypto-BTC', 'crypto-USDT'],
    legal: {
      age_restriction: 'none',
      product_type: 'live-animals-and-agricultural-equipment',
      compliance: 'Australian PIC/NLIS biosecurity law applies to every live-animal sale.',
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
  });
}
