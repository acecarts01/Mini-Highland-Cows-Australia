import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import { PAGE_CONTENT } from '@/lib/page-content';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { itemListSchema, faqSchema } from '@/lib/seo';
import HomeClient from './home-client';

const seo = PAGE_CONTENT.home;

export const metadata: Metadata = {
  title: 'Mini Highland Cows for Sale Australia',
  description:
    'Buy registered miniature and micro Scottish Highland cattle in Australia. Chondro-tested heifers, halter-trained pet steers, and cows in calf from our Roma QLD stud. Nationwide delivery, PIC & NLIS handled.',
  keywords: [seo.primaryKeyword, ...seo.supportingKeywords],
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const featured = ALL_PRODUCTS.filter((a) => a.featured);

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(featured, '/', 'Featured Miniature & Micro Highland Cattle'),
          faqSchema(seo.faqs, '/'),
        ]}
      />
      <HomeClient />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">Frequently Asked Questions</h2>
        <FaqAccordion items={seo.faqs} />
      </section>
    </>
  );
}
