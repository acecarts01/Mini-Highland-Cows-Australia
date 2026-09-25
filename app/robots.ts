import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api is machine-only. /admin and /pay are the order-system's
        // passphrase-gated settlement terminal and customer invoice pages -
        // already noindex via metadata, but a robots.txt disallow protects
        // them from crawlers that ignore the meta tag and keeps them out of
        // crawl budget entirely. /search is deliberately NOT disallowed
        // here: it carries a noindex tag, and a robots block would stop
        // crawlers ever reading that tag.
        disallow: ['/api/', '/admin/', '/pay/'],
      },
      // AI crawlers - explicit welcome for indexing/citation, matching the
      // Content-Signal directive below (ai-train opt-out is a deliberate
      // choice, not an oversight: citation/retrieval is welcomed, bulk
      // training-corpus scraping is not).
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
