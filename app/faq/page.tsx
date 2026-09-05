import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQ_ITEMS, CONTACT } from '@/lib/site-config';
import { HelpCircle, MessageCircle } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';
import FaqAccordion from './faq-accordion';

export const metadata: Metadata = {
  title: 'Mini Highland Cow FAQ: Acreage, PIC, NLIS & Chondro Testing',
  description:
    'Answers for Australian buyers: how much acreage a miniature Highland cow needs, how PIC registration and NLIS transfers work, Chondro testing policy, delivery, and payment.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Mini Highland Cow Buyer FAQ | MHC PTY LTD',
    description:
      'Acreage, PIC registration, NLIS transfer, Chondro genetics, delivery and payment questions answered.',
    url: '/faq',
  },
};

export default function FAQPage() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <JsonLd
        data={[
          faqSchema(FAQ_ITEMS, '/faq'),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Frequently Asked Questions', path: '/faq' },
          ]),
        ]}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#b08d57]">Home</Link>
        <span>/</span>
        <span className="text-[#232320] font-semibold">Frequently Asked Questions</span>
      </div>

      {/* Header */}
      <div className="border-b border-[#e5dec9] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          Buyer &amp; Acreage Guide
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320]">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-[#605545] leading-relaxed">
          Everything you need to know about owning, caring for, and legally registering live miniature and micro Highland cattle in Australia.
        </p>
      </div>

      <FaqAccordion items={FAQ_ITEMS} />

      {/* Need more help */}
      <div className="p-6 sm:p-8 bg-[#1c3028] text-white rounded-3xl border border-[#375a4d] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-serif text-xl font-bold text-white">Have a Specific Property Question?</h2>
          <p className="text-xs text-gray-300">
            Our Roma stud master can assist with fencing assessments, feed planning, or state PIC regulations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Desk
          </a>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-[#b08d57] hover:bg-[#c4a065] text-[#232320] font-bold text-xs transition-colors"
          >
            Contact Page →
          </Link>
        </div>
      </div>
    </div>
  );
}
