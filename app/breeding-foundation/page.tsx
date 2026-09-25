import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import { PAGE_CONTENT } from '@/lib/page-content';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { breadcrumbSchema, itemListSchema, faqSchema } from '@/lib/seo';
import BreedingFoundationClient from './breeding-client';

const seo = PAGE_CONTENT['breeding-foundation'];

export const metadata: Metadata = {
  title: 'Registered Mini Highland Heifers & Pairs',
  description:
    'Registered micro and miniature Highland breeding stock in Australia: Chondro-tested heifers, proven cows in calf, and foundation pairs from our Roma QLD stud. AHCS and IMCBR pedigree.',
  keywords: [seo.primaryKeyword, ...seo.supportingKeywords],
  alternates: { canonical: '/breeding-foundation' },
  openGraph: {
    title: 'Breeding Foundation | Registered Miniature Highland Heifers & Pairs',
    description:
      'Chondro-tested registered heifers, cows in calf, and foundation pairs from our Roma QLD stud.',
    url: '/breeding-foundation',
    images: ['/og-default.png'],
  },
};

export default function BreedingFoundationPage() {
  const animals = ALL_PRODUCTS.filter((a) => a.category === 'breeding-foundation');

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(animals, '/breeding-foundation', 'Breeding Foundation — Registered Miniature Highland Cattle'),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Available Herd', path: '/herd' },
            { name: 'Breeding Foundation', path: '/breeding-foundation' },
          ]),
          faqSchema(seo.faqs, '/breeding-foundation'),
        ]}
      />
      <BreedingFoundationClient />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">Breeding Foundation FAQs</h2>
        <FaqAccordion items={seo.faqs} />
      </section>
    </>
  );
}
