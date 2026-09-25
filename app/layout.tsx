import type { Metadata } from 'next';
import { MotionConfig } from 'motion/react';
import './globals.css';
import SiteLayout from '@/components/SiteLayout';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, organizationSchema, websiteSchema } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mini Highland Cows for Sale Australia | MHC PTY LTD',
    template: '%s | Mini Highland Cows',
  },
  description:
    "Australia's premier breeder of miniature and micro Scottish Highland cattle in Roma, QLD. Live registered heifers, steers, and cows in calf with radical Chondro transparency. Strictly miniature & micro cattle—never big cows.",
  applicationName: 'Mini Highland Cows (MHC PTY LTD)',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Mini Highland Cows for Sale | MHC PTY LTD',
    description:
      "Australia's premier breeder of miniature and micro Highland cattle in Roma, QLD. Strictly true mini cattle.",
    type: 'website',
    locale: 'en_AU',
    url: '/',
    siteName: 'Mini Highland Cows (MHC PTY LTD)',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Mini Highland Cows — Registered Miniature & Micro Scottish Highland Cattle, Roma QLD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Highland Cows for Sale | MHC PTY LTD',
    description:
      "Australia's premier breeder of miniature and micro Highland cattle in Roma, QLD.",
    images: ['/og-default.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/js/webmcp.js" defer />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body
        className="bg-[#fbf9f5] text-[#232320] antialiased min-h-screen flex flex-col font-sans"
        suppressHydrationWarning
      >
        {/* Makes every motion/react animation site-wide (order system,
            blog, product galleries) respect the OS prefers-reduced-motion
            setting automatically, rather than requiring each animated
            component to opt in individually. */}
        <MotionConfig reducedMotion="user">
          <SiteLayout>{children}</SiteLayout>
        </MotionConfig>
      </body>
    </html>
  );
}
