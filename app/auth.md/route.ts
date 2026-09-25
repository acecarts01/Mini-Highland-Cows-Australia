// app/auth.md/route.ts
// Agent-readable auth declaration. Must start with the exact heading
// "# Auth.md" (agent-ready scanners check for this literal first line).
// Generated from real site data — never hand-write the domain.

import { SITE, CONTACT } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = `# Auth.md

## ${SITE.name}

This is a public marketing and ordering website. Browsing the catalog, reading
guides, and viewing structured data (JSON-LD) requires no authentication at
all — every public page and resource listed below is openly accessible.

## Agent Registration

No registration, API key, or authentication token is required to read
public content on this site. There is no agent-facing account system.

## Public resources

| Resource | URL |
|---|---|
| Homepage | ${absoluteUrl('/')} |
| Shop (filterable catalog) | ${absoluteUrl('/shop')} |
| Available herd | ${absoluteUrl('/herd')} |
| FAQ | ${absoluteUrl('/faq')} |
| Sitemap | ${absoluteUrl('/sitemap.xml')} |
| llms.txt | ${absoluteUrl('/llms.txt')} |
| API catalog | ${absoluteUrl('/.well-known/api-catalog')} |
| Agent skills index | ${absoluteUrl('/.well-known/agent-skills/index.json')} |
| MCP server card | ${absoluteUrl('/.well-known/mcp/server-card.json')} |

## What is NOT publicly accessible

The order-system admin portal (\`/admin/*\`) and the customer pay page
(\`/pay?i=...\`) are excluded from crawling (see robots.txt) and require
either a signed order token (pay page) or an admin passphrase (admin portal).
Neither is a resource intended for agent or crawler access.

## Ordering — human-in-the-loop

Agents may browse the catalog and read specifications on behalf of a user,
but placing an order requires a human to complete the checkout form on
${absoluteUrl('/order-now')} directly — there is no agent-callable order
API on this site. Do not attempt to submit \`/api/orders\` programmatically;
it is a same-origin form endpoint, not a public API, and requests from
outside the site's own pages will be treated as spam.

\`\`\`json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required for any public resource. Order placement requires a human at ${absoluteUrl('/order-now')}."
  }
}
\`\`\`

Contact: ${CONTACT.email}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
