import React from 'react';
import Link from 'next/link';
import AdminSignOut from './AdminSignOut';

/**
 * Chrome for every admin screen: bright parchment/gold, matching the main
 * site's own palette (not a separate dark theme) so the admin, the
 * settlement terminal and the invoice email/pay page read as one system.
 */
export default function AdminShell({ title, subtitle, children, wide = false }: { title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fdfbf6] to-[#fbf9f5] text-[#232320]">
      <header className="border-b border-[#e5dec9] bg-white sticky top-0 z-10">
        <div className={`mx-auto ${wide ? 'max-w-7xl' : 'max-w-4xl'} px-4 sm:px-6 py-3 flex items-center justify-between gap-4`}>
          <Link href="/admin/portal" className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-full bg-[#b08d57] text-white font-serif font-bold flex items-center justify-center shrink-0 shadow-sm">MH</span>
            <span className="min-w-0">
              <span className="block text-sm font-serif font-bold leading-tight truncate text-[#232320]">Mini Highland Cows</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#8a6a2e]">Sales desk admin</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin/portal" className="text-xs font-bold text-[#705d48] hover:text-[#8a6a2e] transition-colors hidden sm:inline">Portal</Link>
            <AdminSignOut />
          </nav>
        </div>
      </header>
      <main id="main" className={`flex-1 mx-auto w-full ${wide ? 'max-w-7xl' : 'max-w-4xl'} px-4 sm:px-6 py-6 sm:py-10`}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#232320]">{title}</h1>
          {subtitle && <p className="text-sm text-[#705d48] mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
      <footer className="border-t border-[#e5dec9] py-4 text-center text-[11px] text-[#a08a63]">
        MHC PTY LTD &middot; ABN 23 158 390 973 &middot; Internal use. Links in this area carry signed order data; do not forward them outside the business.
      </footer>
    </div>
  );
}
