import { absoluteUrl } from '@/lib/seo';

// Custom route handler (not the metadata-API robots.ts) because the
// Content-Signal directive - see contentsignals.org - isn't a field
// MetadataRoute.Robots knows how to emit; a raw-text route is the only
// way to add it. ai-train=no opts out of bulk training-corpus scraping;
// search=yes and ai-input=yes keep normal indexing and let AI agents
// read/cite pages for retrieval, matching the explicit AI-crawler
// allow-list below.
export function GET() {
  const body = `User-Agent: *
Content-Signal: ai-train=no, search=yes, ai-input=yes
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /pay/

User-Agent: GPTBot
Allow: /

User-Agent: ChatGPT-User
Allow: /

User-Agent: OAI-SearchBot
Allow: /

User-Agent: ClaudeBot
Allow: /

User-Agent: Claude-Web
Allow: /

User-Agent: anthropic-ai
Allow: /

User-Agent: PerplexityBot
Allow: /

User-Agent: Perplexity-User
Allow: /

User-Agent: Applebot
Allow: /

User-Agent: Applebot-Extended
Allow: /

User-Agent: Amazonbot
Allow: /

User-Agent: Google-Extended
Allow: /

User-Agent: Meta-ExternalAgent
Allow: /

User-Agent: Meta-ExternalFetcher
Allow: /

User-Agent: cohere-ai
Allow: /

User-Agent: Bytespider
Allow: /

User-Agent: Diffbot
Allow: /

User-Agent: PetalBot
Allow: /

User-Agent: YouBot
Allow: /

User-Agent: DuckAssistBot
Allow: /

User-Agent: Ai2Bot
Allow: /

Host: ${absoluteUrl('/')}
Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
