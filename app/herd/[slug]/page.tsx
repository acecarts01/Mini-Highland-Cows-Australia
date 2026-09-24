import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_PRODUCTS, AnimalProduct } from '@/lib/site-config';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, productSchema, faqSchema } from '@/lib/seo';
import { getProductFaqs } from '@/lib/product-faqs';
import AnimalDetail from './animal-detail';

interface AnimalDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Legacy slugs that must keep resolving. The catalog renamed this animal from
 * "Isla" to "Aila" but the slug was left alone, so both spellings are live.
 */
const SLUG_ALIASES: Record<string, string> = {
  'aila-silver-micro-heifer': 'isla-silver-micro-heifer',
};

function findAnimal(slug: string): AnimalProduct | undefined {
  const canonical = SLUG_ALIASES[slug] ?? slug;
  return ALL_PRODUCTS.find((p) => p.slug === canonical);
}

export function generateStaticParams() {
  return ALL_PRODUCTS.map((animal) => ({ slug: animal.slug }));
}

export async function generateMetadata({ params }: AnimalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const animal = findAnimal(slug);

  if (!animal) {
    return { title: 'Animal Not Found' };
  }

  const isLivestock = animal.itemType !== 'equipment' && animal.itemType !== 'feed';
  // Equipment names are already long and descriptive on their own — adding the
  // subcategory label on top pushed titles well past search-result truncation.
  const title = isLivestock
    ? `${animal.name} — ${animal.color} ${animal.sizeClass} Highland ${animal.sex} for Sale`
    : animal.name;

  const canonicalPath = `/herd/${animal.slug}`;

  // animal.shortDescription is written for on-page display and often lands
  // well under the ~120-155 character range a search snippet actually wants.
  // Pad it with the animal's own real facts (price, size, location) rather
  // than inventing new copy — this is usually enough on its own to reach a
  // full-length snippet without truncating awkwardly mid-sentence.
  const priceLine = isLivestock
    ? `$${animal.price.toLocaleString()} AUD. ${animal.color} ${animal.sizeClass} ${animal.sex}.`
    : `$${animal.price.toLocaleString()} AUD.`;
  let description = `${animal.shortDescription} ${priceLine} Roma, QLD — Australia-wide delivery.`;
  if (description.length > 158) {
    description = description.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  }

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: 'website',
      images: [{ url: animal.image, alt: `${animal.name}, ${animal.color} miniature Highland ${animal.sex}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [animal.image],
    },
  };
}

export default async function AnimalDetailPage({ params }: AnimalDetailPageProps) {
  const { slug } = await params;
  const animal = findAnimal(slug);

  if (!animal) {
    notFound();
  }

  const categoryPath =
    animal.category === 'breeding-foundation'
      ? '/breeding-foundation'
      : animal.category === 'paddock-companions'
        ? '/paddock-companions'
        : '/shop';

  const faqs = getProductFaqs(animal);

  return (
    <>
      <JsonLd
        data={[
          productSchema(animal),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Available Herd', path: '/herd' },
            { name: animal.categoryLabel, path: categoryPath },
            { name: animal.name, path: `/herd/${animal.slug}` },
          ]),
          ...(faqs.length ? [faqSchema(faqs, `/herd/${animal.slug}`)] : []),
        ]}
      />
      <AnimalDetail animal={animal} faqs={faqs} />
    </>
  );
}
