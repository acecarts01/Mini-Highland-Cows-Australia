// lib/html-to-markdown.ts
//
// Minimal, dependency-free HTML -> Markdown converter for Markdown
// Negotiation (Accept: text/markdown). Only needs to handle the tags this
// site actually renders inside <main> - it is not a general-purpose
// converter and doesn't try to be.

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}

function stripTags(names: string[], html: string): string {
  let out = html;
  for (const name of names) {
    out = out.replace(new RegExp(`<${name}\\b[^>]*>[\\s\\S]*?<\\/${name}>`, 'gi'), '');
  }
  return out;
}

export function htmlToMarkdown(html: string): string {
  // Isolate <main> when present - drops nav/header/footer chrome that adds
  // no information for an agent reading the page.
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  let body = mainMatch ? mainMatch[1] : html;

  body = stripTags(['script', 'style', 'noscript', 'svg', 'button'], body);

  body = body
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n\n# ${clean(t)}\n\n`)
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${clean(t)}\n\n`)
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${clean(t)}\n\n`)
    .replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n\n#### ${clean(t)}\n\n`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${clean(t)}`)
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => {
      const text = clean(t);
      if (!text) return '';
      return `[${text}](${href})`;
    })
    .replace(/<img\b[^>]*alt="([^"]*)"[^>]*>/gi, (_, alt) => (alt ? `![${alt}]` : ''))
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${clean(t)}**`)
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `*${clean(t)}*`)
    .replace(/<\/(p|div|section|article|tr|table|ul|ol)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n');

  body = body.replace(/<[^>]+>/g, '');
  body = decodeEntities(body);
  body = body
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return body;
}

function clean(fragment: string): string {
  return decodeEntities(fragment.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim();
}

export function estimateMarkdownTokens(markdown: string): number {
  // Rough token estimate (~4 chars/token) - good enough for the
  // informational x-markdown-tokens header, not billed anywhere.
  return Math.ceil(markdown.length / 4);
}
