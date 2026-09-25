// lib/seo.ts
// Canonical URL resolution + JSON-LD builders for structured data.

import { SITE, CONTACT, SHOP, AnimalProduct, getAnimalOrderSpecs } from './site-config';

/**
 * Absolute origin for the deployed site, no trailing slash.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL - set this to the real domain once it is connected.
 *  2. VERCEL_PROJECT_PRODUCTION_URL - injected by Vercel on every deployment.
 *  3. localhost for local development.
 */
export const SITE_URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;

  return 'http://localhost:3000';
})();

export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Roma',
  addressRegion: 'QLD',
  postalCode: '4455',
  addressCountry: 'AU',
};

/** Organization + LocalBusiness identity. Rendered once, in the root layout. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': absoluteUrl('/#organization'),
    name: SITE.name,
    legalName: SITE.companyName,
    alternateName: 'Mini Highland Cows Australia',
    url: absoluteUrl('/'),
    description: SITE.description,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    image: [absoluteUrl('/og-default.png')],
    logo: absoluteUrl('/og-default.png'),
    address: POSTAL_ADDRESS,
    areaServed: { '@type': 'Country', name: 'Australia' },
    identifier: [
      { '@type': 'PropertyValue', name: 'ABN', value: SITE.abn },
      { '@type': 'PropertyValue', name: 'ACN', value: SITE.acn },
    ],
    openingHours: 'Mo-Sa 08:00-18:00',
    priceRange: '$$$',
  };
}

/** WebSite node with the on-site search action. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.locale,
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl('/shop?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Parses "5–10 Business Days" style strings into {min, max} day counts. */
function parseTransitDays(timeframe: string): { min: number; max: number } {
  const match = timeframe.match(/(\d+)\D+(\d+)/);
  return match ? { min: Number(match[1]), max: Number(match[2]) } : { min: 1, max: 14 };
}

/** Product + Offer for a single animal or equipment item. */
export function productSchema(animal: AnimalProduct) {
  const url = absoluteUrl(`/herd/${animal.slug}`);
  const isLivestock = animal.itemType !== 'equipment' && animal.itemType !== 'feed';
  const { min: minDays, max: maxDays } = parseTransitDays(getAnimalOrderSpecs(animal).shippingTimeframe);

  const additionalProperty = [
    animal.sizeClass && { name: 'Size class', value: animal.sizeClass },
    animal.heightInches && { name: 'Mature hip height', value: `${animal.heightInches} inches` },
    animal.color && { name: 'Coat colour', value: animal.color },
    animal.chondroStatus && { name: 'Chondrodysplasia status', value: animal.chondroStatus },
    animal.hornStatus && { name: 'Horn status', value: animal.hornStatus },
    animal.registry && { name: 'Registry', value: animal.registry },
    animal.dobOrAge && { name: 'Age', value: animal.dobOrAge },
    animal.dimensionsOrPack && { name: 'Dimensions / pack', value: animal.dimensionsOrPack },
    animal.warrantyOrShelfLife && { name: 'Warranty / shelf life', value: animal.warrantyOrShelfLife },
  ]
    .filter(Boolean)
    .map((p) => ({ '@type': 'PropertyValue', ...(p as { name: string; value: string }) }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: animal.name,
    sku: animal.id,
    url,
    description: animal.fullDescription,
    image: [absoluteUrl(animal.image)],
    category: `${animal.categoryLabel} > ${animal.subcategoryLabel}`,
    brand: { '@type': 'Brand', name: animal.registry || SITE.companyName },
    ...(isLivestock && animal.color ? { color: animal.color } : {}),
    additionalProperty,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: SITE.currency,
      price: animal.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': absoluteUrl('/#organization') },
      areaServed: { '@type': 'Country', name: 'Australia' },
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      validFrom: `${new Date().getFullYear()}-01-01`,
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: SHOP.shippingFee, currency: SITE.currency },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'AU' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          transitTime: { '@type': 'QuantitativeValue', minValue: minDays, maxValue: maxDays, unitCode: 'DAY' },
        },
      },
    },
  };
}

/** FAQPage from a list of question/answer pairs. */
export function faqSchema(items: { question: string; answer: string }[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Article for a blog post. */
export function articleSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  datePublished: string;
}) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.image)],
    url,
    mainEntityOfPage: url,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    inLanguage: SITE.locale,
    author: { '@id': absoluteUrl('/#organization') },
    publisher: { '@id': absoluteUrl('/#organization') },
  };
}

/** BreadcrumbList. Pass crumbs in order, root first. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** ItemList for category / collection pages, so Google sees the whole set. */
export function itemListSchema(animals: AnimalProduct[], path: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#itemlist`,
    name,
    numberOfItems: animals.length,
    itemListElement: animals.map((animal, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/herd/${animal.slug}`),
      name: animal.name,
    })),
  };
}
