'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE, CONTACT, CATEGORIES, BRANDS } from '@/lib/site-config';
import {
  ShieldCheck,
  Heart,
  Search,
  Menu,
  X,
  MessageCircle,
  MapPin,
  Sparkles,
  ExternalLink,
  Truck,
  ChevronDown,
  Layers,
  Tag,
  ArrowRight,
  HardDrive,
} from 'lucide-react';
import { useEnquiry } from '@/lib/enquiry-context';
import { GoogleDriveSyncModal } from '@/components/GoogleDriveSyncModal';

interface NavbarProps {
  enquiryCount?: number;
  onOpenEnquiryDrawer?: () => void;
  onOpenSearch?: () => void;
}

export default function Navbar({
  enquiryCount: propEnquiryCount,
  onOpenEnquiryDrawer: propOnOpenDrawer,
  onOpenSearch: propOnOpenSearch,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [driveSyncOpen, setDriveSyncOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Try context if available, fallback to props
  let contextEnquiryCount = 0;
  let contextOpenDrawer = () => {};
  let contextOpenSearch = () => {};

  try {
    const ctx = useEnquiry();
    contextEnquiryCount = ctx.enquiryList.length;
    contextOpenDrawer = () => ctx.setIsDrawerOpen(true);
    contextOpenSearch = () => ctx.setIsSearchOpen(true);
  } catch {
    // ignore if outside provider
  }

  const enquiryCount = propEnquiryCount ?? contextEnquiryCount;
  const onOpenEnquiryDrawer = propOnOpenDrawer ?? contextOpenDrawer;
  const onOpenSearch = propOnOpenSearch ?? contextOpenSearch;

  // Handles smooth dropdown hover enter
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShopDropdownOpen(true);
  };

  // Handles smooth dropdown hover exit with slight delay to prevent flickering
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false);
    }, 150);
  };

  const isShopActive = pathname.startsWith('/shop') || pathname.startsWith('/herd') || pathname.startsWith('/breeding-foundation') || pathname.startsWith('/paddock-companions');
  const isHomepage = pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5] border-b border-[#e5dec9] shadow-xs">
      {/* Top ABN & Verification Bar */}
      <div className="bg-[#232320] text-[#f4efe6] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1 font-semibold text-[#e5c07b] bg-[#34342e] px-2 py-0.5 rounded text-[11px] tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e5c07b]" />
              VERIFIED ASIC BREEDER
            </span>
            {!isHomepage && (
              <>
                <span className="font-mono text-gray-300 text-[11px] sm:text-xs">
                  ABN: <strong className="text-white">{SITE.abn}</strong> | ACN: {SITE.acn}
                </span>
                {/* Direct ABN Verification Redirect Button */}
                <a
                  href={SITE.abnLookupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#b08d57] hover:bg-[#c9a367] text-[#232320] font-bold text-[10px] sm:text-[11px] transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                  title="Verify MHC PTY LTD directly on the Australian Business Register (abr.business.gov.au)"
                >
                  <span>Verify ABN on ABR.gov.au</span>
                  <ExternalLink className="w-3 h-3 text-[#232320]" />
                </a>
                <span className="hidden md:inline-flex items-center gap-1 text-gray-400">
                  <MapPin className="w-3 h-3 text-[#e5c07b]" />
                  {SITE.locality}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <span className="hidden lg:inline-flex items-center gap-1 text-[#e5c07b] font-medium">
              <Sparkles className="w-3 h-3" />
              100% True Mini &amp; Micro Highland Cattle • Never Big Cows
            </span>
            <button
              onClick={() => setDriveSyncOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#34342e] hover:bg-[#b08d57] text-[#e5c07b] hover:text-[#1c3028] border border-[#b08d57]/50 font-bold transition-all shadow-xs cursor-pointer"
              title="Sync images from Google Drive folder 'Mini Highland Cows Product Images'"
            >
              <HardDrive className="w-3 h-3" />
              <span>Drive Photos Sync</span>
            </button>
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Live Desk
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-20 py-2">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Custom SVG Roundel Crest */}
              <div className="w-12 h-12 rounded-full bg-[#1c3028] border-2 border-[#b08d57] flex items-center justify-center text-[#e5c07b] shadow-sm group-hover:border-[#d4af37] transition-colors">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#232320]">
                    Mini Highland Cows
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#ebdcb9] text-[#6d4c1b]">
                    MHC PTY LTD
                  </span>
                </div>
                <p className="text-xs text-[#705d48] font-medium tracking-wide">
                  100% Miniature &amp; Micro Cattle • Roma, QLD
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Menus: Order Now, Shop Page (with Dropdown), Blog Page, About Page, Contact Us */}
          <nav className="hidden lg:flex items-center gap-3 text-sm font-semibold text-[#40382d]">
            {/* 1. Order Now */}
            <Link
              href="/order-now"
              className={`group relative px-4 py-2 rounded-full flex items-center gap-2 font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                pathname === '/order-now'
                  ? 'bg-gradient-to-r from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] border-2 border-[#b08d57] shadow-[0_0_15px_rgba(229,192,123,0.45)]'
                  : 'bg-white/90 hover:bg-gradient-to-r hover:from-[#1c3028] hover:to-[#244234] text-[#1c3028] hover:text-[#e5c07b] border border-[#b08d57]/60 hover:border-[#e5c07b] shadow-xs hover:shadow-[0_0_16px_rgba(229,192,123,0.4)]'
              }`}
            >
              <Truck className="w-4 h-4 text-[#b08d57] group-hover:text-[#e5c07b] transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span>Order Now</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981] border border-[#e5c07b]"></span>
              </span>
            </Link>

            {/* 2. Shop Page with Dropdown (Shop by Category & Brands) */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className={`group relative px-4 py-2 rounded-full flex items-center gap-2 font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                  isShopActive
                    ? 'bg-gradient-to-r from-[#1c3028] to-[#254235] text-[#e5c07b] border-2 border-[#b08d57] shadow-[0_0_15px_rgba(229,192,123,0.4)]'
                    : 'bg-white/90 hover:bg-gradient-to-r hover:from-[#1c3028] hover:to-[#243e32] text-[#232320] hover:text-[#e5c07b] border border-[#e5dec9] hover:border-[#b08d57] shadow-xs hover:shadow-[0_0_15px_rgba(229,192,123,0.35)]'
                }`}
                aria-expanded={shopDropdownOpen}
              >
                {/* Pulsing Green/Gold live stock beacon */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e5c07b] opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981] border border-[#e5c07b]" />
                </span>
                <span>Shop</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#ebdcb9] text-[#6d4c1b] group-hover:bg-[#b08d57] group-hover:text-[#1c3028] font-bold transition-colors">
                  72 Head
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    shopDropdownOpen ? 'rotate-180 text-[#e5c07b]' : 'text-[#b08d57] group-hover:text-[#e5c07b]'
                  }`}
                />
              </button>

              {/* Dropdown Menu Panel */}
              {shopDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-white rounded-2xl shadow-2xl border-2 border-[#b08d57]/50 p-6 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Glowing Gold/Green Top Bar */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#1c3028] via-[#e5c07b] to-[#1c3028] rounded-t-xl -mt-6 -mx-6 mb-5" />

                  <div className="grid grid-cols-2 gap-6">
                    {/* Column 1: Shop by Category */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#f4efe6]">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c3028] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#b08d57]" />
                          Shop by Category
                        </h3>
                        <Link
                          href="/shop"
                          onClick={() => setShopDropdownOpen(false)}
                          className="text-[11px] font-bold text-[#b08d57] hover:text-[#1c3028] hover:underline flex items-center gap-1"
                        >
                          <span>View All (72)</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="space-y-2">
                        {/* All Cattle */}
                        <Link
                          href="/shop"
                          onClick={() => setShopDropdownOpen(false)}
                          className="block p-2.5 rounded-xl bg-[#fbf9f5] hover:bg-gradient-to-r hover:from-[#fdfbf7] hover:to-[#f5edd8] border border-[#e5dec9] hover:border-[#b08d57] hover:shadow-xs transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#232320] group-hover:text-[#1c3028]">
                              All Miniature &amp; Micro Cattle
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ebdcb9] group-hover:bg-[#1c3028] text-[#6d4c1b] group-hover:text-[#e5c07b] font-bold transition-colors">
                              72 Head
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            Complete catalog of DNA-verified stock.
                          </p>
                        </Link>

                        {/* Breeding Foundation */}
                        <div className="p-2.5 rounded-xl bg-[#fbf9f5] border border-[#e5dec9] hover:border-[#b08d57]/70 transition-all space-y-1.5">
                          <Link
                            href="/shop?category=breeding-foundation"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-xs font-bold text-[#232320] hover:text-[#b08d57] flex items-center justify-between group"
                          >
                            <span className="group-hover:translate-x-1 transition-transform">Breeding Foundation</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1c3028] text-[#e5c07b] font-bold">36 Head</span>
                          </Link>
                          <div className="pl-2 space-y-1 text-[11px] text-gray-600 border-l-2 border-[#b08d57]/40">
                            <Link
                              href="/shop?category=breeding-foundation&sub=heifers"
                              onClick={() => setShopDropdownOpen(false)}
                              className="block hover:text-[#b08d57] hover:translate-x-1 transition-all"
                            >
                              • Registered Heifers (Micro &amp; Mini)
                            </Link>
                            <Link
                              href="/shop?category=breeding-foundation&sub=cows-in-calf-pairs"
                              onClick={() => setShopDropdownOpen(false)}
                              className="block hover:text-[#b08d57] hover:translate-x-1 transition-all"
                            >
                              • Cows in Calf &amp; Foundation Pairs
                            </Link>
                          </div>
                        </div>

                        {/* Paddock Companions */}
                        <div className="p-2.5 rounded-xl bg-[#fbf9f5] border border-[#e5dec9] hover:border-[#b08d57]/70 transition-all space-y-1.5">
                          <Link
                            href="/shop?category=paddock-companions"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-xs font-bold text-[#232320] hover:text-[#b08d57] flex items-center justify-between group"
                          >
                            <span className="group-hover:translate-x-1 transition-transform">Paddock Companions</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1c3028] text-[#e5c07b] font-bold">36 Head</span>
                          </Link>
                          <div className="pl-2 space-y-1 text-[11px] text-gray-600 border-l-2 border-[#b08d57]/40">
                            <Link
                              href="/shop?category=paddock-companions&sub=steers"
                              onClick={() => setShopDropdownOpen(false)}
                              className="block hover:text-[#b08d57] hover:translate-x-1 transition-all"
                            >
                              • Halter-Trained Steers (Pets)
                            </Link>
                            <Link
                              href="/shop?category=paddock-companions&sub=weaners-calves"
                              onClick={() => setShopDropdownOpen(false)}
                              className="block hover:text-[#b08d57] hover:translate-x-1 transition-all"
                            >
                              • Weaned Calves &amp; Bottle Babies
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Shop by Brands / Stud Genetics */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#f4efe6]">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c3028] flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#b08d57]" />
                          Shop by Brands &amp; Bloodlines
                        </h3>
                      </div>

                      <div className="space-y-1.5">
                        {BRANDS.map((brand) => (
                          <Link
                            key={brand.id}
                            href={`/shop?brand=${brand.slug}`}
                            onClick={() => setShopDropdownOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-gradient-to-r hover:from-[#fbf9f5] hover:to-[#ebdcb9]/40 border border-transparent hover:border-[#b08d57]/50 transition-all group"
                          >
                            <div className="group-hover:translate-x-1 transition-transform">
                              <p className="text-xs font-bold text-[#232320] group-hover:text-[#1c3028] transition-colors">
                                {brand.name}
                              </p>
                              <p className="text-[10px] text-gray-500 line-clamp-1">
                                {brand.description}
                              </p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f4efe6] text-gray-700 font-semibold shrink-0 group-hover:bg-[#1c3028] group-hover:text-[#e5c07b] transition-colors">
                              {brand.badge}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Bottom Banner */}
                  <div className="mt-4 pt-3 border-t-2 border-[#b08d57]/30 flex items-center justify-between text-xs bg-gradient-to-r from-[#1c3028] to-[#254236] -mx-6 -mb-6 p-4 rounded-b-xl text-white">
                    <span className="text-gray-200 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#e5c07b]" />
                      Direct paddock delivery Australia-wide • Verified Stud PIC Biosecurity
                    </span>
                    <Link
                      href="/shop"
                      onClick={() => setShopDropdownOpen(false)}
                      className="font-bold text-[#e5c07b] hover:text-white flex items-center gap-1 transition-colors group"
                    >
                      <span>Open Full Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Blog Page */}
            <Link
              href="/blog"
              className={`group relative px-4 py-2 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                pathname.startsWith('/blog')
                  ? 'bg-gradient-to-r from-[#1c3028] to-[#254235] text-[#e5c07b] border-2 border-[#b08d57] shadow-[0_0_12px_rgba(229,192,123,0.4)]'
                  : 'bg-white/80 hover:bg-gradient-to-r hover:from-[#fcfaf5] hover:to-[#ebdcb9]/60 text-[#2e2922] hover:text-[#1c3028] border border-transparent hover:border-[#b08d57]/60 shadow-xs hover:shadow-[0_0_12px_rgba(229,192,123,0.25)]'
              }`}
            >
              <span>Blog</span>
            </Link>

            {/* 4. About Page */}
            <Link
              href="/about"
              className={`group relative px-4 py-2 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                pathname === '/about'
                  ? 'bg-gradient-to-r from-[#1c3028] to-[#254235] text-[#e5c07b] border-2 border-[#b08d57] shadow-[0_0_12px_rgba(229,192,123,0.4)]'
                  : 'bg-white/80 hover:bg-gradient-to-r hover:from-[#fcfaf5] hover:to-[#ebdcb9]/60 text-[#2e2922] hover:text-[#1c3028] border border-transparent hover:border-[#b08d57]/60 shadow-xs hover:shadow-[0_0_12px_rgba(229,192,123,0.25)]'
              }`}
            >
              <span>About</span>
            </Link>

            {/* 5. Contact Us */}
            <Link
              href="/contact"
              className={`group relative px-4 py-2 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                pathname === '/contact'
                  ? 'bg-gradient-to-r from-[#1c3028] to-[#254235] text-[#e5c07b] border-2 border-[#b08d57] shadow-[0_0_12px_rgba(229,192,123,0.4)]'
                  : 'bg-white/80 hover:bg-gradient-to-r hover:from-[#fcfaf5] hover:to-[#ebdcb9]/60 text-[#2e2922] hover:text-[#1c3028] border border-transparent hover:border-[#b08d57]/60 shadow-xs hover:shadow-[0_0_12px_rgba(229,192,123,0.25)]'
              }`}
            >
              <span>Contact Us</span>
            </Link>
          </nav>

          {/* Action Buttons: Search + Order Now Box + Hold Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full text-[#40382d] hover:bg-[#ebdcb9]/50 transition-colors cursor-pointer"
              aria-label="Search Cattle"
              title="Search Herd by Name, Color or Trait"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Order Now Box (Direct Paddock Delivery) */}
            <Link
              href="/order-now"
              className="relative flex items-center gap-2 bg-[#1c3028] hover:bg-[#284439] text-[#e5c07b] hover:text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95 border border-[#b08d57]/40"
              aria-label="Order Now - Direct Paddock Delivery"
            >
              <Truck className="w-4 h-4 text-[#e5c07b]" />
              <span>Order Now</span>
              <span className="hidden sm:inline-block text-[10px] bg-[#ebdcb9] text-[#6d4c1b] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Direct
              </span>
            </Link>

            {/* Hold list trigger if user has saved items */}
            {enquiryCount > 0 && (
              <button
                onClick={onOpenEnquiryDrawer}
                className="relative p-2.5 rounded-full text-[#b08d57] hover:bg-[#ebdcb9]/40 transition-colors cursor-pointer"
                aria-label="View Saved Animals"
                title={`${enquiryCount} cattle saved in your hold list`}
              >
                <Heart className="w-5 h-5 fill-[#b08d57]" />
                <span className="absolute -top-1 -right-1 bg-[#1c3028] text-[#e5c07b] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#b08d57]">
                  {enquiryCount}
                </span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#40382d] hover:bg-[#ebdcb9]/40 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f4efe6] border-t border-[#e5dec9] px-4 pt-3 pb-6 space-y-3">
          <div className="p-3.5 bg-white rounded-xl border border-[#e5dec9] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[#232320]">MHC PTY LTD (ROMA QLD)</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">Verified ASIC Breeder</span>
            </div>
            {!isHomepage && (
              <>
                <p className="text-gray-600 font-mono text-[11px]">ABN: 23 158 390 973 • ACN: 158 390 973</p>
                {/* Direct ABN Verification Redirect Button */}
                <a
                  href={SITE.abnLookupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#b08d57] hover:bg-[#977340] text-[#232320] hover:text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <span>Verify ABN on Official Register (abr.business.gov.au)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            )}
            <p className="text-emerald-700 font-medium text-[11px]">✓ 100% Miniature &amp; Micro Highland Cattle</p>
          </div>

          {/* Quick Order Now Mobile Box */}
          <Link
            href="/order-now"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#1c3028] hover:bg-[#284439] text-[#e5c07b] rounded-xl text-sm font-bold shadow-sm transition-colors border border-[#b08d57]/40"
          >
            <Truck className="w-4 h-4 text-[#e5c07b]" />
            <span>Order Now (Direct Paddock Delivery)</span>
          </Link>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-1.5 text-base font-semibold text-[#232320]">
            {/* 1. Order Now */}
            <Link
              href="/order-now"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl transition-all flex items-center justify-between border ${
                pathname === '/order-now'
                  ? 'bg-gradient-to-r from-[#1c3028] to-[#244234] text-[#e5c07b] border-[#b08d57] font-bold shadow-sm'
                  : 'bg-white hover:bg-gradient-to-r hover:from-[#1c3028] hover:to-[#244234] hover:text-[#e5c07b] border-[#e5dec9] hover:border-[#b08d57]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#b08d57]" />
                <span>Order Now (Direct Paddock Delivery)</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            </Link>

            {/* 2. Shop Page with Dropdown / Accordion */}
            <div className="rounded-xl bg-white border border-[#e5dec9] overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-3">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bold text-[#232320] hover:text-[#b08d57] flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#e5c07b]" />
                  <span>Shop Page (All 72 Head)</span>
                </Link>
                <button
                  onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                  className="p-1.5 rounded-lg text-[#1c3028] hover:bg-[#ebdcb9]/50 cursor-pointer transition-colors"
                  aria-label="Toggle shop categories and brands"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${mobileShopExpanded ? 'rotate-180 text-[#b08d57]' : ''}`}
                  />
                </button>
              </div>

              {mobileShopExpanded && (
                <div className="p-3.5 bg-[#fbf9f5] border-t-2 border-[#b08d57]/30 space-y-3 text-xs">
                  {/* Shop by Category */}
                  <div>
                    <span className="font-bold text-[#1c3028] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-[#b08d57]" />
                      Shop by Category
                    </span>
                    <div className="space-y-1 pl-2 border-l-2 border-[#b08d57]/40">
                      <Link
                        href="/shop?category=breeding-foundation"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 font-medium hover:text-[#b08d57] transition-colors"
                      >
                        • Breeding Foundation (Heifers &amp; Pairs)
                      </Link>
                      <Link
                        href="/shop?category=paddock-companions"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 font-medium hover:text-[#b08d57] transition-colors"
                      >
                        • Paddock Companions (Steers &amp; Calves)
                      </Link>
                    </div>
                  </div>

                  {/* Shop by Brands */}
                  <div>
                    <span className="font-bold text-[#1c3028] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#b08d57]" />
                      Shop by Brands &amp; Bloodlines
                    </span>
                    <div className="space-y-1 pl-2 border-l-2 border-[#b08d57]/40">
                      {BRANDS.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/shop?brand=${brand.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1 font-medium hover:text-[#b08d57] transition-colors"
                        >
                          • {brand.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Blog Page */}
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl transition-all border ${
                pathname.startsWith('/blog')
                  ? 'bg-gradient-to-r from-[#1c3028] to-[#244234] text-[#e5c07b] border-[#b08d57] font-bold shadow-sm'
                  : 'bg-white hover:bg-gradient-to-r hover:from-[#1c3028] hover:to-[#244234] hover:text-[#e5c07b] border-[#e5dec9] hover:border-[#b08d57]'
              }`}
            >
              Blog Page
            </Link>

            {/* 4. About Page */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl transition-all border ${
                pathname === '/about'
                  ? 'bg-gradient-to-r from-[#1c3028] to-[#244234] text-[#e5c07b] border-[#b08d57] font-bold shadow-sm'
                  : 'bg-white hover:bg-gradient-to-r hover:from-[#1c3028] hover:to-[#244234] hover:text-[#e5c07b] border-[#e5dec9] hover:border-[#b08d57]'
              }`}
            >
              About Page
            </Link>

            {/* 5. Contact Us */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl transition-all border ${
                pathname === '/contact'
                  ? 'bg-gradient-to-r from-[#1c3028] to-[#244234] text-[#e5c07b] border-[#b08d57] font-bold shadow-sm'
                  : 'bg-white hover:bg-gradient-to-r hover:from-[#1c3028] hover:to-[#244234] hover:text-[#e5c07b] border-[#e5dec9] hover:border-[#b08d57]'
              }`}
            >
              Contact Us
            </Link>
          </div>

          <div className="pt-3 border-t border-[#e5dec9] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDriveSyncOpen(true);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#232320] text-[#e5c07b] rounded-lg text-sm font-semibold hover:bg-[#34342e] transition-colors border border-[#b08d57]/50"
            >
              <HardDrive className="w-4 h-4" />
              <span>Sync Drive Product Photos</span>
            </button>
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Live Desk
            </a>
          </div>
        </div>
      )}

      {/* Google Drive Image Sync & WebForge Optimization Modal */}
      <GoogleDriveSyncModal
        isOpen={driveSyncOpen}
        onClose={() => setDriveSyncOpen(false)}
      />
    </header>
  );
}
