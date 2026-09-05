import type { MetadataRoute } from 'next';
import { ALL_PRODUCTS, BLOG_POSTS } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
    { path: '/herd', priority: 0.9, changeFrequency: 'daily' },
    { path: '/breeding-foundation', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/paddock-companions', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/order-now', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/chondro-guide', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...ALL_PRODUCTS.map((product) => ({
      url: absoluteUrl(`/herd/${product.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.datePublished),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
