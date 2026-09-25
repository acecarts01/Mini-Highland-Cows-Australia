import React from 'react';
import type { Metadata } from 'next';
import SearchClient from './search-client';

export const metadata: Metadata = {
  title: 'Search the Herd',
  description:
    'Search available miniature and micro Highland cattle by name, coat colour, sex, or size class.',
  // Query-driven duplicate of /shop — keep it out of the index but let crawlers
  // follow the links through to the individual animal pages.
  robots: { index: false, follow: true },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Read `q` on the server and pass it as a prop — calling useSearchParams()
  // in the client component instead opts the page out of the server render,
  // shipping crawlers the Suspense fallback with no H1 and no results.
  const { q } = await searchParams;
  return <SearchClient initialQuery={q} />;
}
