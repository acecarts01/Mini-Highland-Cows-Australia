import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import { PAGE_CONTENT } from '@/lib/page-content';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { breadcrumbSchema, itemListSchema, faqSchema } from '@/lib/seo';
import ShopClient from './shop-client';

const seo = PAGE_CONTENT.shop;

export const metadata: Metadata = {
  title: 'Shop Mini Highland Cows & Cattle Gear',
  description:
    'Browse every available micro and miniature Highland cow, steer, cow in calf, and premium cattle care product. Filter by size class, coat colour, Chondro status, and registry.',
  keywords: [seo.primaryKeyword, ...seo.supportingKeywords],
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop Miniature & Micro Highland Cattle | MHC PTY LTD',
    description:
      'Filter the full herd by size class, coat colour, Chondro status, and registry.',
    url: '/shop',
    images: ['/og-default.png'],
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
          faqSchema(seo.faqs, '/shop'),
        ]}
      />
      <ShopClient
        category={first(params.category, 'all')}
        sub={first(params.sub, 'all')}
        brand={first(params.brand, 'all')}
        q={first(params.q, '')}
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">Shop FAQs</h2>
        <FaqAccordion items={seo.faqs} />
      </section>
    </>
  );
}
