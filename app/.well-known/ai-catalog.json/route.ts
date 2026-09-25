// ARD (Agentic Resource Discovery) manifest — agenticresourcediscovery.org
// Lists only real, currently-resolvable resources this site has (Rule 10 —
// never claim a capability that doesn't exist). Restricted to entries whose
// "type" is one of the spec's actual accepted discovery media types
// (application/mcp-server-card+json, application/agent-card+json, etc) —
// plain content pages like /shop or /faq don't fit that taxonomy and were
// dropped rather than mislabeled; they're still fully discoverable via
// auth.md, /.well-known/api-catalog, and the agent-skills index.
//
// Schema is spec/schemas/ai-catalog.schema.json in ards-project/ard-spec -
// "host" is additionalProperties:false and does NOT accept a "url" field
// (only displayName/identifier/documentationUrl/logoUrl/trustManifest); an
// earlier version of this file included host.url and failed Lighthouse's
// "Agentic Browsing" schema validation as a result.

import { SITE } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

function identifier(namespace: string, name: string): string {
  return `urn:air:${SITE.domain}:${namespace}:${name}`;
}

export function GET() {
  const body = {
    specVersion: '1.0',
    host: {
      displayName: SITE.name,
      documentationUrl: absoluteUrl('/faq'),
    },
    entries: [
      {
        identifier: identifier('discovery', 'mcp-server-card'),
        displayName: 'MCP server card',
        type: 'application/mcp-server-card+json',
        url: absoluteUrl('/.well-known/mcp/server-card.json'),
        description: 'Declares this site’s MCP capabilities honestly: no live MCP transport is deployed yet, so it lists discoverable HTML resources only.',
        representativeQueries: [
          'does this site have an MCP server',
          'MHC PTY LTD miniature highland cattle MCP capabilities',
        ],
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
