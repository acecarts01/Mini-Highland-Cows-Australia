import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/site-config';
import { BLOG_CONTENT } from '@/lib/blog-content';
import { ChevronRight, Calendar, Clock, ArrowLeft, ShieldCheck, Truck, HelpCircle } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/seo';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return { title: 'Guide Not Found' };
  }

  const canonicalPath = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalPath,
      type: 'article',
      publishedTime: post.datePublished,
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const article = BLOG_CONTENT[slug] || {
    subtitle: post.excerpt,
    primaryKeyword: post.title,
    supportingKeywords: [],
    sections: [
      {
        title: 'Livestock Care & Best Practices',
        body: post.excerpt,
      },
    ],
    faqs: [],
  };

  return (
    <div className="space-y-10 pb-20">
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          ...(article.faqs.length ? [faqSchema(article.faqs, `/blog/${post.slug}`)] : []),
        ]}
      />

      {/* 1. Breadcrumbs */}
      <div className="bg-[#fbf9f5] border-b border-[#e5dec9] py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#b08d57]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-[#b08d57]">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#232320] font-semibold truncate max-w-xs">{post.title}</span>
          </div>
        </div>
      </div>

      {/* 2. Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#b08d57] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Guides
          </Link>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#b08d57]" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#b08d57]" />
              {post.readTime}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#ebdcb9] text-[#6d4c1b] font-bold">
              MHC Stud Editorial
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320] leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-serif italic border-l-4 border-[#b08d57] pl-4">
            {article.subtitle}
          </p>
        </div>

        {/* Featured Image Frame */}
        {post.image && (
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-2xl overflow-hidden border border-[#e5dec9] bg-white shadow-xs">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-contain p-2"
              sizes="(max-width: 1024px) 100vw, 896px"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* 3. Main Body Sections */}
        <div className="prose prose-stone max-w-none space-y-8 text-gray-800 text-sm sm:text-base leading-relaxed">
          {article.sections.map((section, idx) => (
            <section key={idx} className="p-6 bg-white rounded-2xl border border-[#e5dec9] shadow-xs space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#232320]">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* 3b. FAQs */}
        {article.faqs.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320] flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#b08d57]" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {article.faqs.map((faq, idx) => (
                <details key={idx} className="group p-5 bg-white rounded-2xl border border-[#e5dec9] shadow-xs">
                  <summary className="font-serif font-bold text-[#232320] cursor-pointer list-none flex items-center justify-between gap-3">
                    {faq.question}
                    <ChevronRight className="w-4 h-4 text-[#b08d57] shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* 4. Action Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c3028] text-white border border-[#375a4d] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs text-[#e5c07b] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#e5c07b]" />
              MHC PTY LTD • ABN: 23 158 390 973
            </span>
            <h3 className="font-serif text-xl font-bold">Interested in Current Available Stock?</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Browse our 72 micro and miniature cattle or place a direct paddock delivery order online.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full bg-[#e5c07b] hover:bg-[#d4af37] text-[#232320] font-bold text-xs transition-all shadow-sm"
            >
              Shop All Cattle
            </Link>
            <Link
              href="/order-now"
              className="px-6 py-3 rounded-full bg-white text-[#232320] hover:bg-gray-100 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#b08d57]" />
              Order Now
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
