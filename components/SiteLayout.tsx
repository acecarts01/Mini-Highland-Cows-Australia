'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { EnquiryProvider, useEnquiry } from '@/lib/enquiry-context';
import Navbar from './Navbar';
import EnquiryDrawer from './EnquiryDrawer';
import AnimalModal from './AnimalModal';
import SearchModal from './SearchModal';
import ChatHub from './ChatHub';
import Footer from './Footer';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const {
    enquiryList,
    isDrawerOpen,
    setIsDrawerOpen,
    isSearchOpen,
    setIsSearchOpen,
    inspectedAnimal,
    setInspectedAnimal,
    toggleEnquiry,
    removeEnquiry,
    clearEnquiry,
  } = useEnquiry();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#1c3028] focus:text-white focus:text-sm focus:font-bold"
      >
        Skip to content
      </a>

      <Navbar
        enquiryCount={enquiryList.length}
        onOpenEnquiryDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Shared Modals & Drawers */}
      <EnquiryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        enquiredAnimals={enquiryList}
        onRemove={removeEnquiry}
        onClear={clearEnquiry}
      />

      <AnimalModal
        animal={inspectedAnimal}
        isOpen={!!inspectedAnimal}
        onClose={() => setInspectedAnimal(null)}
        isEnquired={inspectedAnimal ? enquiryList.some((a) => a.id === inspectedAnimal.id) : false}
        onToggleEnquiry={toggleEnquiry}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAnimal={(animal) => {
          setIsSearchOpen(false);
          setInspectedAnimal(animal);
        }}
      />

      <ChatHub />
    </div>
  );
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The admin portal and the client's hosted invoice are their own
  // standalone surfaces (AdminShell / the pay page's own header) - they
  // must never carry the marketing site's navbar, footer, chat widget or
  // enquiry drawer. The client in particular is never meant to see the
  // main site's chrome around their invoice.
  const bare = pathname?.startsWith('/admin') || pathname?.startsWith('/pay');
  if (bare) return <>{children}</>;

  return (
    <EnquiryProvider>
      <LayoutInner>{children}</LayoutInner>
    </EnquiryProvider>
  );
}
