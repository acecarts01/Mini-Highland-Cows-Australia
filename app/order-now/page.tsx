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

interface OrderNowPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OrderNowPage({ searchParams }: OrderNowPageProps) {
  // Read the animal id/slug on the server and hand it to the client
  // component as a prop, the same way /shop does. Calling useSearchParams()
  // inside the client component instead opts the whole page out of the
  // server render, shipping Googlebot the Suspense fallback ("Loading Order
  // Portal...") with no H1 and none of the actual order form — a real bug
  // found via a JSON-LD/H1 audit of the built HTML output.
  const params = await searchParams;
  const animalParam = first(params.animal) || first(params.slug);

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
      <OrderNowClient animalParam={animalParam} />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">Ordering FAQs</h2>
        <FaqAccordion items={seo.faqs} />
      </section>
    </>
  );
}
