import { SITE } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    resource: absoluteUrl('/'),
    resource_name: `${SITE.name} — Public Catalog`,
    authorization_servers: [],
    scopes_supported: [],
    bearer_methods_supported: [],
    resource_documentation: absoluteUrl('/auth.md'),
    resource_policy_uri: absoluteUrl('/faq'),
    tls_client_certificate_bound_access_tokens: false,
    note: `All public resources on ${SITE.domain} are openly accessible. No OAuth tokens are required.`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
  });
}
