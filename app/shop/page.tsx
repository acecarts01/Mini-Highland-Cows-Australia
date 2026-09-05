import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';
import ShopClient from './shop-client';

export const metadata: Metadata = {
  title: 'Shop Mini Highland Cows, Steers & Cattle Care Equipment',
  description:
    'Browse every available micro and miniature Highland cow, steer, cow in calf, and premium cattle care product. Filter by size class, coat colour, Chondro status, and registry.',
  keywords: [
    'mini highland cows for sale australia',
    'micro miniature highland cows',
    'miniature cattle for sale qld',
    'cattle grooming blower australia',
  ],
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop Miniature & Micro Highland Cattle | MHC PTY LTD',
    description:
      'Filter the full herd by size class, coat colour, Chondro status, and registry.',
    url: '/shop',
  },
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined, fallback: string): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Read the filters on the server and hand them to the client component as
  // props. Calling useSearchParams() inside it instead would opt the whole
  // grid out of the server render, hiding every animal link from crawlers.
  const params = await searchParams;

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(ALL_PRODUCTS, '/shop', 'Available Miniature Highland Cattle & Care Equipment'),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
          ]),
        ]}
      />
      <ShopClient
        category={first(params.category, 'all')}
        sub={first(params.sub, 'all')}
        brand={first(params.brand, 'all')}
        q={first(params.q, '')}
      />
    </>
  );
}
