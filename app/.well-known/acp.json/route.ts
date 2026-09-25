// Agentic Commerce Protocol discovery. Ordering is deliberately declared
// "human-assisted" — no agent-callable purchase endpoint exists.

import { SITE, CONTACT } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    protocol: { name: 'acp', version: '0.1.0' },
    name: SITE.name,
    description: SITE.description,
    api_base_url: absoluteUrl('/'),
    homepage: absoluteUrl('/'),
    transports: ['https'],
    capabilities: {
      services: ['product-catalog', 'faq', 'blog'],
      ordering: 'human-assisted-form',
      payment_methods: ['bank-transfer', 'crypto-BTC', 'crypto-USDT'],
      currency: SITE.currency,
    },
    contact: {
      email: CONTACT.email,
      whatsapp: `https://wa.me/${CONTACT.whatsapp.replace('+', '')}`,
    },
    legal: {
      age_restriction: 'none',
      region: 'Australia',
      ships_to: 'Australia (nationwide)',
      product_type: 'live-animals-and-agricultural-equipment',
      compliance: 'Australian PIC/NLIS biosecurity law applies to every live-animal sale.',
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
  });
}
