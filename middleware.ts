import { NextRequest, NextResponse } from 'next/server';
import { htmlToMarkdown, estimateMarkdownTokens } from '@/lib/html-to-markdown';

// Markdown Negotiation for agents (see isitagentready.com "Content" check).
// A request with Accept: text/markdown gets the page's <main> content
// converted to Markdown instead of the full HTML document; browsers
// (Accept: text/html) are completely unaffected. Re-fetches the same URL
// with a bypass header so this middleware doesn't recurse on itself.

const BYPASS_HEADER = 'x-md-bypass';

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  if (!accept.includes('text/markdown')) return false;
  // Respect explicit q-values: text/markdown must not be strictly lower
  // priority than text/html when both are present.
  const weight = (type: string) => {
    const entry = accept.split(',').find((p) => p.trim().startsWith(type));
    if (!entry) return null;
    const q = entry.match(/q=([\d.]+)/);
    return q ? parseFloat(q[1]) : 1;
  };
  const md = weight('text/markdown');
  const htmlQ = weight('text/html');
  if (md === null) return false;
  if (htmlQ === null) return true;
  return md >= htmlQ;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    request.headers.get(BYPASS_HEADER) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/.well-known') ||
    pathname.includes('.') || // static files (images, css, xml, txt, etc.)
    request.method !== 'GET'
  ) {
    return NextResponse.next();
  }

  if (!prefersMarkdown(request.headers.get('accept'))) {
    return NextResponse.next();
  }

  const origin = request.nextUrl.origin;
  const htmlResponse = await fetch(new URL(pathname + request.nextUrl.search, origin), {
    headers: { accept: 'text/html', [BYPASS_HEADER]: '1' },
  });

  if (!htmlResponse.ok) {
    return NextResponse.next();
  }

  const html = await htmlResponse.text();
  const markdown = htmlToMarkdown(html);

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(estimateMarkdownTokens(markdown)),
      Vary: 'Accept',
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
