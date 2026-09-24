import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';
import HerdClient from './herd-client';

export const metadata: Metadata = {
  title: 'Available Mini Highland Cows for Sale',
  description:
    'The complete live availability list for our Roma QLD stud — micro and miniature Highland heifers, steers, cows in calf, and foundation pairs, each with height, coat colour, and Chondro status.',
  keywords: [
    'available mini highland cows',
    'miniature highland cattle for sale now',
    'micro highland heifer australia',
  ],
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
        ]}
      />
      <HerdClient />
    </>
  );
}
