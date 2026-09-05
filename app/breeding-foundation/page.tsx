import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';
import BreedingFoundationClient from './breeding-client';

export const metadata: Metadata = {
  title: 'Registered Miniature Highland Heifers & Cows in Calf for Sale',
  description:
    'Registered micro and miniature Highland breeding stock in Australia: Chondro-tested heifers, proven cows in calf, and foundation pairs from our Roma QLD stud. AHCS and IMCBR pedigree.',
  keywords: [
    'registered mini highland cattle',
    'miniature highland heifer for sale australia',
    'mini highland cow in calf',
    'foundation breeding pair mini highland',
  ],
  alternates: { canonical: '/breeding-foundation' },
  openGraph: {
    title: 'Breeding Foundation | Registered Miniature Highland Heifers & Pairs',
    description:
      'Chondro-tested registered heifers, cows in calf, and foundation pairs from our Roma QLD stud.',
    url: '/breeding-foundation',
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
        ]}
      />
      <BreedingFoundationClient />
    </>
  );
}
