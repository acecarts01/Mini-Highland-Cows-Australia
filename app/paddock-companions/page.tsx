import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import { PAGE_CONTENT } from '@/lib/page-content';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { breadcrumbSchema, itemListSchema, faqSchema } from '@/lib/seo';
import PaddockCompanionsClient from './paddock-client';

const seo = PAGE_CONTENT['paddock-companions'];

export const metadata: Metadata = {
  title: 'Mini Highland Steers & Pet Calves',
  description:
    'Docile desexed miniature Highland steers and hand-reared bottle calves for Australian lifestyle acreage. Halter-trained, vaccinated, and delivered nationwide from Roma QLD.',
  keywords: [seo.primaryKeyword, ...seo.supportingKeywords],
  alternates: { canonical: '/paddock-companions' },
  openGraph: {
    title: 'Paddock Companions | Miniature Highland Steers & Pet Calves',
    description:
      'Halter-trained desexed steers and hand-reared calves for Australian lifestyle acreage.',
    url: '/paddock-companions',
    images: ['/og-default.png'],
  },
};

export default function PaddockCompanionsPage() {
  const animals = ALL_PRODUCTS.filter((a) => a.category === 'paddock-companions');

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(animals, '/paddock-companions', 'Paddock Companions — Miniature Highland Steers & Calves'),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Available Herd', path: '/herd' },
            { name: 'Paddock Companions', path: '/paddock-companions' },
          ]),
          faqSchema(seo.faqs, '/paddock-companions'),
        ]}
      />
      <PaddockCompanionsClient />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">Paddock Companion FAQs</h2>
        <FaqAccordion items={seo.faqs} />
      </section>
    </>
  );
}
