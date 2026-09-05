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

export default function SearchPage() {
  return <SearchClient />;
}
