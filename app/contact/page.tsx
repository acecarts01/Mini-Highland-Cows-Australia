import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';
import { PAGE_CONTENT } from '@/lib/page-content';
import ContactClient from './contact-client';

const seo = PAGE_CONTENT.contact;

export const metadata: Metadata = {
  title: 'Contact Our Roma QLD Miniature Highland Stud',
  description:
    'Talk to MHC PTY LTD about availability, transport quotes, PIC registration help, or pedigree paperwork for miniature and micro Highland cattle anywhere in Australia.',
  keywords: [seo.primaryKeyword, ...seo.supportingKeywords],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Mini Highland Cows | Roma QLD',
    description:
      'Availability, transport quotes, PIC registration assistance and pedigree paperwork.',
    url: '/contact',
    images: ['/og-default.png'],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          faqSchema(seo.faqs, '/contact'),
        ]}
      />
      <ContactClient />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">Contact FAQs</h2>
        <FaqAccordion items={seo.faqs} />
      </section>
    </>
  );
}
