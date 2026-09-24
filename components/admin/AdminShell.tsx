import React from 'react';
import Link from 'next/link';
import AdminSignOut from './AdminSignOut';

/**
 * Chrome for every admin screen: forest band, MHC wordmark, section title,
 * sign-out. Design tokens match the transactional emails (forest / gold /
 * parchment) so the card, the terminal and the invoice read as one system.
 */
export default function AdminShell({ title, subtitle, children, wide = false }: { title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1a15] text-white">
      <header className="border-b border-white/10 bg-[#1c3028]">
        <div className={`mx-auto ${wide ? 'max-w-7xl' : 'max-w-4xl'} px-4 sm:px-6 py-3 flex items-center justify-between gap-4`}>
          <Link href="/admin/portal" className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-lg bg-[#b08d57] text-[#1c3028] font-serif font-bold flex items-center justify-center shrink-0">MH</span>
            <span className="min-w-0">
              <span className="block text-sm font-serif font-bold leading-tight truncate">Mini Highland Cows</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#e5c07b]">Sales desk admin</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin/portal" className="text-xs font-bold text-[#a9b4a2] hover:text-[#e5c07b] transition-colors hidden sm:inline">Portal</Link>
            <AdminSignOut />
          </nav>
        </div>
      </header>
      <main id="main" className={`flex-1 mx-auto w-full ${wide ? 'max-w-7xl' : 'max-w-4xl'} px-4 sm:px-6 py-8 sm:py-10`}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[#a9b4a2] mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
      <footer className="border-t border-white/10 py-4 text-center text-[11px] text-[#a9b4a2]">
        MHC PTY LTD &middot; ABN 23 158 390 973 &middot; Internal use. Links in this area carry signed order data; do not forward them outside the business.
      </footer>
    </div>
  );
}
