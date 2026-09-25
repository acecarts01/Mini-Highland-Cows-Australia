import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';
import { PAGE_CONTENT } from '@/lib/page-content';
import OrderNowClient from './order-client';

const seo = PAGE_CONTENT['order-now'];

export const metadata: Metadata = {
  title: 'Order & Reserve Your Mini Highland Cow',
  description:
    'Reserve your miniature or micro Highland cow. Review pedigree and veterinary specifications, provide your PIC and delivery address, and choose bank transfer or a holding deposit.',
  keywords: [seo.primaryKeyword, ...seo.supportingKeywords],
  alternates: { canonical: '/order-now' },
  openGraph: {
    title: 'Order & Reserve | Mini Highland Cows Australia',
    description:
      'Reserve your animal, provide delivery details and PIC, and choose your payment method.',
    url: '/order-now',
    images: ['/og-default.png'],
  },
};

export default function OrderNowPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Order & Reserve', path: '/order-now' },
          ]),
          faqSchema(seo.faqs, '/order-now'),
        ]}
      />
      <OrderNowClient />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">Ordering FAQs</h2>
        <FaqAccordion items={seo.faqs} />
      </section>
    </>
  );
}
