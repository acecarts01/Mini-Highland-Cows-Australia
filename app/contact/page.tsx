import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import ContactClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contact Our Roma QLD Miniature Highland Stud',
  description:
    'Talk to MHC PTY LTD about availability, transport quotes, PIC registration help, or pedigree paperwork for miniature and micro Highland cattle anywhere in Australia.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Mini Highland Cows | Roma QLD',
    description:
      'Availability, transport quotes, PIC registration assistance and pedigree paperwork.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <ContactClient />
    </>
  );
}
