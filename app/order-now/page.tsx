import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import OrderNowClient from './order-client';

export const metadata: Metadata = {
  title: 'Order & Reserve Your Mini Highland Cow',
  description:
    'Reserve your miniature or micro Highland cow. Review pedigree and veterinary specifications, provide your PIC and delivery address, and choose bank transfer or a holding deposit.',
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
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Order & Reserve', path: '/order-now' },
        ])}
      />
      <OrderNowClient />
    </>
  );
}
