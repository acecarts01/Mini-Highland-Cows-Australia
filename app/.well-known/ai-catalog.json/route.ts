// ARD (Agentic Resource Discovery) manifest — agenticresourcediscovery.org
// Lists only real, currently-resolvable resources this site has (Rule 10 —
// never claim a capability that doesn't exist). Entries mirror auth.md and
// /.well-known/api-catalog rather than adding anything new.

import { SITE } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

function urn(namespace: string, name: string): string {
  return `urn:air:${SITE.domain}:${namespace}:${name}`;
}

export function GET() {
  const body = {
    specVersion: '1.0',
    host: {
      name: SITE.name,
      url: absoluteUrl('/'),
    },
    entries: [
      {
        urn: urn('catalog', 'shop'),
        displayName: 'Shop — filterable cattle & equipment catalog',
        type: 'text/html',
        url: absoluteUrl('/shop'),
        representativeQueries: [
          'miniature highland cows for sale',
          'micro highland heifers Australia',
          'registered highland cattle Roma QLD',
        ],
      },
      {
        urn: urn('catalog', 'herd'),
        displayName: 'Available herd — live listings',
        type: 'text/html',
        url: absoluteUrl('/herd'),
        representativeQueries: ['available highland heifers now', 'chondro tested cows in calf'],
      },
      {
        urn: urn('docs', 'faq'),
        displayName: 'Frequently asked questions',
        type: 'text/html',
        url: absoluteUrl('/faq'),
        representativeQueries: ['how big do micro highland cows get', 'do highland cows need horns removed'],
      },
      {
        urn: urn('docs', 'llms-txt'),
        displayName: 'llms.txt — brand and fact sheet for LLMs',
        type: 'text/plain',
        url: absoluteUrl('/llms.txt'),
        representativeQueries: ['what is MHC PTY LTD', 'mini highland cow breeder facts'],
      },
      {
        urn: urn('sitemap', 'full'),
        displayName: 'Full XML sitemap',
        type: 'application/xml',
        url: absoluteUrl('/sitemap.xml'),
        representativeQueries: ['all pages on minihighlandcow.com.au'],
      },
      {
        urn: urn('discovery', 'mcp-server-card'),
        displayName: 'MCP server card',
        type: 'application/json',
        url: absoluteUrl('/.well-known/mcp/server-card.json'),
        representativeQueries: ['does this site have an MCP server'],
      },
      {
        urn: urn('discovery', 'agent-skills'),
        displayName: 'Agent skills index',
        type: 'application/json',
        url: absoluteUrl('/.well-known/agent-skills/index.json'),
        representativeQueries: ['what agent skills does this site expose'],
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
