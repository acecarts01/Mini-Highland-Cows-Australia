import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';
import PaddockCompanionsClient from './paddock-client';

export const metadata: Metadata = {
  title: 'Mini Highland Steers & Pet Calves',
  description:
    'Docile desexed miniature Highland steers and hand-reared bottle calves for Australian lifestyle acreage. Halter-trained, vaccinated, and delivered nationwide from Roma QLD.',
  keywords: [
    'miniature highland steer for sale',
    'mini highland cow pet australia',
    'halter trained mini highland calf',
    'paddock companion miniature cattle',
  ],
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
        ]}
      />
      <PaddockCompanionsClient />
    </>
  );
}
