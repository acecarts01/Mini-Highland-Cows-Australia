import React from 'react';
import type { Metadata } from 'next';
import { ALL_PRODUCTS } from '@/lib/site-config';
import JsonLd from '@/components/JsonLd';
import { itemListSchema } from '@/lib/seo';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'Mini Highland Cows for Sale Australia | Micro & Miniature Highland Cattle',
  description:
    'Buy registered miniature and micro Scottish Highland cattle in Australia. Chondro-tested heifers, halter-trained pet steers, and cows in calf from our Roma QLD stud. Nationwide delivery, PIC & NLIS handled.',
  keywords: [
    'mini highland cows for sale',
    'miniature highland cattle australia',
    'micro highland cow',
    'mini highland cow price australia',
    'miniature highland cattle breeders',
    'fluffy cows for sale',
  ],
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const featured = ALL_PRODUCTS.filter((a) => a.featured);

  return (
    <>
      <JsonLd
        data={itemListSchema(featured, '/', 'Featured Miniature & Micro Highland Cattle')}
      />
      <HomeClient />
    </>
  );
}
