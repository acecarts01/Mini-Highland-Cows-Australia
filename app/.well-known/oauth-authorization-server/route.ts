import { SITE } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    issuer: absoluteUrl('/'),
    authorization_endpoint: null,
    token_endpoint: null,
    jwks_uri: null,
    grant_types_supported: [],
    response_types_supported: [],
    scopes_supported: [],
    note: `${SITE.name} has no protected APIs. All resources are publicly accessible.`,
    public_resources: [
      absoluteUrl('/shop'),
      absoluteUrl('/herd'),
      absoluteUrl('/faq'),
      absoluteUrl('/blog'),
      absoluteUrl('/llms.txt'),
      absoluteUrl('/.well-known/api-catalog'),
      absoluteUrl('/.well-known/agent-skills/index.json'),
      absoluteUrl('/.well-known/mcp/server-card.json'),
    ],
    agent_auth: {
      register_uri: null,
      identity_types_supported: ['none'],
      credential_types_supported: ['none'],
      notes: 'No registration required. All content is publicly accessible to agents.',
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
  });
}
