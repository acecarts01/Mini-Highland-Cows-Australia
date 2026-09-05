import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS, SITE, CONTACT } from '@/lib/site-config';
import { Sparkles, Calendar, Clock, ArrowRight, BookOpen, ShieldCheck, ChevronRight } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, articleSchema, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Miniature Highland Cattle Guides & Care Blog',
  description:
    'Expert guides on miniature Scottish Highland cattle care, pricing, chondrodysplasia genetics, and Australian PIC/NLIS livestock transfer regulations.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Miniature Highland Cattle Guides & Care Blog',
    description:
      'Care, pricing, genetics, and Australian livestock compliance guides from our Roma QLD stud.',
    url: '/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="space-y-12 pb-20">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${absoluteUrl('/blog')}#blog`,
            name: 'Miniature Highland Cattle Guides & Care Blog',
            url: absoluteUrl('/blog'),
            publisher: { '@id': absoluteUrl('/#organization') },
            blogPost: BLOG_POSTS.map((post) => articleSchema(post)),
          },
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-b from-[#ebdcb9]/40 to-transparent pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#b08d57]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#232320] font-semibold">Educational Blog &amp; Guides</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <span className="text-xs uppercase tracking-wider font-bold text-[#b08d57] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#b08d57]" />
              Stud Knowledge Base • MHC PTY LTD
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320]">
              Miniature Highland Cattle Guides &amp; Care Blog
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Transparent, factual advice for lifestyle acreage owners, breeders, and pet enthusiasts across Australia. Covering realistic pricing, chondrodysplasia genetics, feed management, and legal livestock transfers.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl border border-[#e5dec9] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Card visual image */}
              <div className="relative aspect-4/3 w-full bg-[#fcfaf6] border-b border-[#e5dec9] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 text-[11px] px-3 py-1 rounded-full bg-[#1c3028]/90 backdrop-blur-xs text-[#e5c07b] font-bold shadow-xs">
                  {idx === 0
                    ? 'Pricing Guide'
                    : idx === 1
                    ? 'Genetics & Standards'
                    : idx === 2
                    ? 'Livestock Legal'
                    : idx === 3
                    ? 'Pet Steers'
                    : idx === 4
                    ? 'Grooming Masterclass'
                    : 'Foundation Pairs'}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#b08d57]" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#b08d57]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-[#232320] group-hover:text-[#b08d57] transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f4efe6]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#b08d57] group-hover:text-[#977340] flex items-center gap-1.5"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Authority Knowledge Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#fbf9f5] border border-[#e5dec9] space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#b08d57]">
            <ShieldCheck className="w-4 h-4 text-[#b08d57]" />
            <span>Official Breeder Transparency Principle</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#232320]">
            Why We Publish Uncompromising Livestock Care Facts
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed max-w-4xl">
            The market for miniature Highland cattle in Australia has exploded, but unfortunately so has misinformation. We believe prospective cattle parents deserve genuine honesty: accurate mature height predictions, transparent DNA Chondrodysplasia disclosures, realistic veterinary costs, and legal biosecurity compliance through mandatory PIC registration.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="px-6 py-2.5 rounded-full bg-[#b08d57] hover:bg-[#977340] text-white font-bold text-xs transition-colors"
            >
              Browse Available Cattle
            </Link>
            <Link
              href="/chondro-guide"
              className="px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-[#cfc4af] text-[#232320] font-bold text-xs transition-colors"
            >
              View Chondrodysplasia Genetics Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
