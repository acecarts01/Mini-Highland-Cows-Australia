import type { Metadata } from 'next';
import './globals.css';
import SiteLayout from '@/components/SiteLayout';

export const metadata: Metadata = {
  title: 'Mini Highland Cows for Sale | MHC PTY LTD (ABN 23 158 390 973)',
  description: "Australia's premier breeder of miniature and micro Scottish Highland cattle in Roma, QLD. Live registered heifers, steers, and cows in calf with radical Chondro transparency. Strictly miniature & micro cattle—never big cows.",
  openGraph: {
    title: 'Mini Highland Cows for Sale | MHC PTY LTD',
    description: "Australia's premier breeder of miniature and micro Highland cattle in Roma, QLD. Strictly true mini cattle.",
    type: 'website',
    locale: 'en_AU',
    siteName: 'Mini Highland Cows (MHC PTY LTD)',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Highland Cows for Sale | MHC PTY LTD',
    description: "Australia's premier breeder of miniature and micro Highland cattle in Roma, QLD.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#fbf9f5] text-[#232320] antialiased min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
