import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import { PAGE_CONTENT } from '@/lib/page-content';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { breadcrumbSchema, itemListSchema, faqSchema } from '@/lib/seo';
import HerdClient from './herd-client';

const seo = PAGE_CONTENT.herd;

export const metadata: Metadata = {
  title: 'Available Mini Highland Cows for Sale',
  description:
    'The complete live availability list for our Roma QLD stud — micro and miniature Highland heifers, steers, cows in calf, and foundation pairs, each with height, coat colour, and Chondro status.',
  keywords: [seo.primaryKeyword, ...seo.supportingKeywords],
  alternates: { canonical: '/herd' },
  openGraph: {
    title: 'Available Herd | Mini Highland Cows for Sale',
    description:
      'Live availability for micro and miniature Highland heifers, steers, and cows in calf.',
    url: '/herd',
    images: ['/og-default.png'],
  },
};

export default function HerdPage() {
  const livestock = ALL_PRODUCTS.filter((a) => a.category !== 'care-equipment');

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(livestock, '/herd', 'Available Miniature & Micro Highland Cattle'),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Available Herd', path: '/herd' },
          ]),
          faqSchema(seo.faqs, '/herd'),
        ]}
      />
      <HerdClient />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">Available Herd FAQs</h2>
        <FaqAccordion items={seo.faqs} />
      </section>
    </>
  );
}
