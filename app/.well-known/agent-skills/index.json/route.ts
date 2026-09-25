// Cloudflare Agent Skills Discovery RFC v0.2.0. Each "skill" is a real,
// resolvable page action — nothing here claims a capability (like a
// callable order API) the site doesn't actually have.

import { SITE } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const ZERO_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

export function GET() {
  const body = {
    $schema: 'https://agentskills.io/schema/v0.2.0/index.json',
    name: SITE.name,
    url: absoluteUrl('/'),
    description: SITE.description,
    skills: [
      {
        name: 'browse-catalog',
        type: 'navigation',
        description: 'Browse the full catalog of miniature and micro Highland cattle and care equipment, filterable by category, size class, colour, and Chondro status.',
        url: absoluteUrl('/shop'),
        sha256: ZERO_HASH,
      },
      {
        name: 'view-available-herd',
        type: 'navigation',
        description: 'View the live-availability list of cattle currently for sale.',
        url: absoluteUrl('/herd'),
        sha256: ZERO_HASH,
      },
      {
        name: 'search-catalog',
        type: 'navigation',
        description: 'Search the catalog by name, coat colour, sex, or size class.',
        url: absoluteUrl('/search'),
        sha256: ZERO_HASH,
      },
      {
        name: 'start-order',
        type: 'commerce',
        description: 'Start a human-completed order/reservation for a specific animal. This is a form a person fills in themselves — not an agent-callable API.',
        url: absoluteUrl('/order-now'),
        sha256: ZERO_HASH,
      },
      {
        name: 'read-faq',
        type: 'content',
        description: 'Read answers on acreage, PIC registration, NLIS transfer, Chondro genetics, delivery and payment.',
        url: absoluteUrl('/faq'),
        sha256: ZERO_HASH,
      },
      {
        name: 'contact',
        type: 'support',
        description: 'Contact the stud for availability, transport quotes, or paperwork questions.',
        url: absoluteUrl('/contact'),
        sha256: ZERO_HASH,
      },
    ],
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
