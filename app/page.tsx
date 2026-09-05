'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ALL_PRODUCTS,
  AnimalProduct,
  CATEGORIES,
  FAQ_ITEMS,
  SITE,
  CONTACT,
} from '@/lib/site-config';
import AnimalCard from '@/components/AnimalCard';
import { useEnquiry } from '@/lib/enquiry-context';
import {
  ShieldCheck,
  Sparkles,
  Heart,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Calendar,
  Truck,
  Phone,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Ruler,
  Award,
  AlertTriangle,
  Info,
  ExternalLink,
  HardDrive,
} from 'lucide-react';
import { GoogleDriveSyncModal } from '@/components/GoogleDriveSyncModal';

export default function HomePage() {
  const { enquiryList, toggleEnquiry, setInspectedAnimal } = useEnquiry();

  // Homepage Category Filter State
  const [homepageCategoryFilter, setHomepageCategoryFilter] = useState<'all' | 'breeding-foundation' | 'paddock-companions' | 'care-equipment'>('all');

  // Google Drive Sync Modal State
  const [driveSyncOpen, setDriveSyncOpen] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter 8 featured products (foundation heifers/cows, paddock steers/calves, and premium care gear)
  const featuredEight: AnimalProduct[] = [
    ALL_PRODUCTS.find((p) => p.id === 'mhc-01')!, // Isla (34" Silver Micro Heifer)
    ALL_PRODUCTS.find((p) => p.id === 'mhc-02')!, // Thistle (32" Snow White Micro Heifer)
    ALL_PRODUCTS.find((p) => p.id === 'mhc-03')!, // Bramble (33" Jet Black Micro Heifer)
    ALL_PRODUCTS.find((p) => p.id === 'mhc-29')!, // Rory & Fern (36" Silver Foundation Pair)
    ALL_PRODUCTS.find((p) => p.id === 'mhc-45')!, // Angus (34" Tiger Brindle Micro Steer)
    ALL_PRODUCTS.find((p) => p.id === 'mhc-47')!, // Archie (33" Snow White Micro Steer)
    ALL_PRODUCTS.find((p) => p.id === 'mhc-62')!, // Buttons (25" White Bottle Baby Heifer Calf)
    ALL_PRODUCTS.find((p) => p.id === 'mhc-eq-01')!, // Royal Highland Master Pro Show Blower
  ].filter(Boolean);

  // Filtered animals based on category tab (exactly 8 displayed on homepage)
  const filteredCategoryAnimals = ALL_PRODUCTS.filter((a) => {
    if (homepageCategoryFilter !== 'all' && a.category !== homepageCategoryFilter) return false;
    return true;
  });

  const displayedAnimals =
    homepageCategoryFilter === 'all'
      ? featuredEight
      : filteredCategoryAnimals.slice(0, 8);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Strict Size Standard Banner */}
      <div className="bg-[#1c3028] text-white py-3 px-4 text-center border-b border-[#375a4d]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e5c07b] text-[#232320] font-bold text-xs uppercase tracking-wide">
            <Ruler className="w-3.5 h-3.5" />
            STRICT BREEDING POLICY
          </span>
          <span className="font-medium text-gray-200">
            We breed &amp; sell <strong>ONLY Miniature &amp; Micro Highland Cows (&lt;42&quot; Hip Height)</strong>. We strictly NEVER sell big or commercial-sized cattle!
          </span>
          <Link
            href="/about"
            className="text-[#e5c07b] underline hover:text-white text-xs font-semibold ml-1"
          >
            Learn About Our Size Standards →
          </Link>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#b08d57]" />
              Australia&apos;s Premier Miniature Highland Cattle Stud
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#232320] leading-[1.1]">
              Rare Miniature &amp; <br />
              <span className="text-[#b08d57]">Micro Highland Cows</span>
            </h1>

            {/* Sub-headline explicitly stating MINI COWS ONLY */}
            <p className="text-base sm:text-lg text-[#554a3a] leading-relaxed max-w-2xl font-medium">
              Purebred Scottish Highland cattle selectively bred down to gentle miniature and micro heights (32&quot; to 42&quot; mature hip height). 
              <strong> We sell ONLY petite miniature cattle tailored for small acreage and family companionship—strictly no big standard cattle.</strong>
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#e5dec9] shadow-xs">
                <span className="block text-[11px] text-gray-500 uppercase font-semibold">Mature Height</span>
                <strong className="text-[#1c3028] text-sm">32&quot; – 42&quot; Only</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e5dec9] shadow-xs">
                <span className="block text-[11px] text-gray-500 uppercase font-semibold">Pasture Footprint</span>
                <strong className="text-[#1c3028] text-sm">1 to 5 Acres</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e5dec9] shadow-xs col-span-2 sm:col-span-1">
                <span className="block text-[11px] text-gray-500 uppercase font-semibold">Chondro Testing</span>
                <strong className="text-[#1c3028] text-sm">100% DNA Tested</strong>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#1c3028] via-[#244234] to-[#1c3028] hover:from-[#244234] hover:to-[#335948] text-[#e5c07b] hover:text-white font-bold text-sm transition-all shadow-md hover:shadow-[0_0_20px_rgba(229,192,123,0.45)] hover:scale-105 active:scale-95 flex items-center gap-2 border border-[#b08d57]/60 group"
              >
                <Sparkles className="w-4 h-4 text-[#e5c07b] group-hover:rotate-12 transition-transform" />
                <span>Browse Available Cattle (72 Head)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#ebdcb9]/40 text-[#1c3028] font-bold text-sm transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 border border-[#b08d57]"
              >
                <ShieldCheck className="w-4 h-4 text-[#b08d57]" />
                <span>Verified Stud Credentials (ABN)</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#f8f5ee]">
              <Image
                src="/images/aila-silver-micro-heifer.webp"
                alt="Aila - Rare Silver Micro Miniature Scottish Highland Heifer standing on Australian pasture"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="bg-[#b08d57] text-[#232320] px-2.5 py-0.5 rounded-full font-bold">
                    Featured Micro Heifer
                  </span>
                  <span>Mature Height: 34&quot;</span>
                </div>
                <p className="font-serif text-lg font-bold">Aila • Rare Silver Micro Heifer</p>
                <p className="text-xs text-gray-200">Docile, halter-broken, DNA Non-Chondro tested.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2B. Official ABN Instant Verification Bar & Biosecurity Notice */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-white via-[#fcfaf5] to-white border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-sm hover:shadow-[0_4px_20px_rgba(176,141,87,0.15)] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3028] to-[#284439] text-[#e5c07b] border border-[#b08d57]/50 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#e5c07b]" />
            </div>
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-sm text-[#1c3028]">
                  Official Registered Entity: <span className="font-serif font-bold text-[#b08d57]">MHC PTY LTD</span>
                </p>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  ✓ Active Registered Australian Business
                </span>
              </div>
              <p className="font-mono text-gray-600">
                ABN: <strong className="text-[#232320]">23 158 390 973</strong> • ACN: 158 390 973 • Registered Locality: ROMA QLD 4455
              </p>
              <p className="text-[11px] text-[#6d4c1b] font-medium">
                • 100% NLIS Ear-Tagged &amp; PIC-Compliant • Certified Closed-Gate Stud Biosecurity
              </p>
            </div>
          </div>

          {/* Immediate ABN Website Redirect Button */}
          <a
            href={SITE.abnLookupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#b08d57] via-[#c49f65] to-[#b08d57] hover:from-[#977340] hover:to-[#b08d57] text-white font-bold text-xs transition-all shadow-sm hover:shadow-[0_0_15px_rgba(176,141,87,0.4)] flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="Click to immediately verify MHC PTY LTD on the official Australian Government Business Register"
          >
            <span>Verify ABN on Official Register (abr.business.gov.au)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 3. Sizing Comparison: Big Cows vs Mini Cows */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b08d57]">
              Biological Size Clarification
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">
              Why We Specialize Exclusively in Mini Cows
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Compare standard commercial cattle with our miniature and micro breeding lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Big Cow */}
            <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                  Standard Cattle
                </span>
                <span className="text-xs bg-red-200 text-red-900 font-bold px-2 py-0.5 rounded">
                  ✕ We Do Not Sell
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#232320]">Standard Highland Cow</h3>
              <ul className="text-xs space-y-1.5 text-gray-700">
                <li>• <strong>Height:</strong> 48&quot; to 56&quot; at the hip</li>
                <li>• <strong>Weight:</strong> 500kg to 800kg</li>
                <li>• <strong>Acreage:</strong> Requires 5–10+ acres</li>
                <li>• <strong>Fencing:</strong> Heavy commercial cattle yards</li>
                <li>• <strong>Intimidation:</strong> Can intimidate young children</li>
              </ul>
            </div>

            {/* Miniature Highland Cow */}
            <div className="p-5 rounded-2xl bg-[#f8f5ee] border-2 border-[#b08d57] space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6d4c1b]">
                  Miniature Highland
                </span>
                <span className="text-xs bg-[#ebdcb9] text-[#6d4c1b] font-bold px-2 py-0.5 rounded">
                  ✓ Available Here
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#232320]">Miniature Highland Cow</h3>
              <ul className="text-xs space-y-1.5 text-gray-700">
                <li>• <strong>Height:</strong> 36&quot; to 42&quot; mature hip height</li>
                <li>• <strong>Weight:</strong> 250kg to 400kg</li>
                <li>• <strong>Acreage:</strong> Ideal for 2 to 5 acre paddocks</li>
                <li>• <strong>Fencing:</strong> Standard farm/horse fencing</li>
                <li>• <strong>Temperament:</strong> Halter-trained, calm, gentle</li>
              </ul>
            </div>

            {/* Micro Highland Cow */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                  Micro Highland
                </span>
                <span className="text-xs bg-purple-200 text-purple-950 font-bold px-2 py-0.5 rounded">
                  ✓ Rare Micro Lines
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#232320]">Micro Highland Cow</h3>
              <ul className="text-xs space-y-1.5 text-gray-700">
                <li>• <strong>Height:</strong> Strictly under 36&quot; (under 92cm)</li>
                <li>• <strong>Weight:</strong> Under 250kg mature weight</li>
                <li>• <strong>Acreage:</strong> Perfect for 1 to 2 acre lifestyle blocks</li>
                <li>• <strong>Handling:</strong> Hand-raised, bottle-fed, pet stature</li>
                <li>• <strong>Companions:</strong> Perfect companion for families</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOMEPAGE PRODUCTS SECTION: EXACTLY 8 PRODUCTS WITH ANIMATED MENU */}
      <section id="featured-herd" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5dec9] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ebdcb9] to-[#f4ead5] text-[#6d4c1b] text-xs font-bold uppercase tracking-wider mb-2 border border-[#b08d57]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#b08d57] animate-spin-slow" />
              <span>Hand-Selected Premier Miniature Cattle</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#232320]">
              Featured Mini Cattle &amp; Equipment (8 of 33)
            </h2>
            <p className="text-xs sm:text-sm text-[#605545] max-w-2xl mt-1">
              Showing 8 featured items from our curated selection of 23 miniature cattle and 10 premium care equipment and feeds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setDriveSyncOpen(true)}
              className="px-4 py-2.5 rounded-full bg-[#1c3028] hover:bg-[#284439] text-[#e5c07b] border border-[#b08d57]/60 font-bold text-xs transition-all shadow-sm hover:shadow-[0_0_15px_rgba(229,192,123,0.3)] flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Sync product images from Google Drive folder 'Mini Highland Cows Product Images'"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#e5c07b]" />
              <span>Drive Photos Sync</span>
            </button>
            <Link
              href="/herd"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#b08d57] to-[#977340] text-white font-bold text-xs hover:from-[#977340] hover:to-[#b08d57] transition-all shadow-sm hover:shadow-[0_0_15px_rgba(176,141,87,0.4)] flex items-center gap-1.5 active:scale-95"
            >
              <span>Explore All 33 on Herd Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* High Visibility Animated Category Tabs Menu with Gold & Green Themes */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-gradient-to-r from-white via-[#fcfaf5] to-white rounded-2xl border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-sm hover:shadow-[0_4px_20px_rgba(176,141,87,0.18)] transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-700 border border-[#e5c07b]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1c3028] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#b08d57]" />
              Filter by Category:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                id: 'all' as const,
                label: 'All Catalog',
                subLabel: 'Complete herd & gear',
                count: 33,
                icon: null,
              },
              {
                id: 'breeding-foundation' as const,
                label: 'Breeding Foundation',
                subLabel: 'Docile purebred genetics',
                count: 16,
                icon: Award,
              },
              {
                id: 'paddock-companions' as const,
                label: 'Paddock Companions',
                subLabel: 'Low maintenance',
                count: 7,
                icon: Heart,
              },
              {
                id: 'care-equipment' as const,
                label: 'Care & Equipment',
                subLabel: 'Pasture & coat health',
                count: 10,
                icon: ShieldCheck,
              },
            ].map((cat) => {
              const isActive = homepageCategoryFilter === cat.id;
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.id}
                  id={`filter-${cat.id}`}
                  onClick={() => setHomepageCategoryFilter(cat.id)}
                  title={`${cat.label}: ${cat.subLabel}`}
                  className={`group relative px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-start cursor-pointer text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] border-2 border-[#b08d57] shadow-[0_0_15px_rgba(229,192,123,0.4)] scale-105'
                      : 'bg-white hover:bg-[#fbf9f5] text-[#232320] hover:text-[#1c3028] border border-[#e5dec9] hover:border-[#b08d57] hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    {IconComponent && <IconComponent className="w-3.5 h-3.5 text-[#b08d57]" />}
                    <span>{cat.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#ebdcb9] text-[#6d4c1b] font-mono font-bold ml-1">
                      {cat.count}
                    </span>
                  </div>

                  {/* Sub-label detailing specific benefit, revealed on hover */}
                  <div className="overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0 group-hover:max-h-6 group-hover:opacity-100 group-hover:mt-1 group-focus-visible:max-h-6 group-focus-visible:opacity-100 group-focus-visible:mt-1">
                    <span
                      className={`text-[10px] font-medium tracking-tight block whitespace-nowrap ${
                        isActive ? 'text-[#e5c07b]' : 'text-[#8b6528]'
                      }`}
                    >
                      {cat.subLabel}
                    </span>
                  </div>

                  {/* Animated hover tooltip badge revealing sub-label */}
                  <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-30 bg-[#1c3028] text-[#e5c07b] text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-md border border-[#b08d57]/40">
                    {cat.subLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedAnimals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              isEnquired={enquiryList.some((a) => a.id === animal.id)}
              onToggleEnquiry={toggleEnquiry}
              onInspect={setInspectedAnimal}
            />
          ))}
        </div>

        {/* Callout Box: View on Dedicated Herd Page */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-white via-[#fcfaf5] to-white rounded-3xl border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-xs hover:shadow-[0_4px_20px_rgba(176,141,87,0.15)] transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-[#232320]">
              Looking for a Specific Color, Calving Pair, or Care Equipment?
            </h3>
            <p className="text-xs text-gray-600">
              Explore all <strong>33 catalog items</strong> including 23 miniature cattle (rare Silvers, Snow Whites, Dun Heifers, Halter-Broken Steers) plus 10 premium stud equipment &amp; feeds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/herd"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] hover:text-white font-bold text-xs transition-all shadow-sm hover:shadow-[0_0_20px_rgba(229,192,123,0.4)] hover:scale-105 active:scale-95 flex items-center gap-2 border border-[#b08d57]/60"
            >
              <span>View All 33 on Herd Page</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#e5c07b]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Dedicated Menu Pages Grid (Each Menu Has an Individual Page) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#b08d57]">
            Dedicated Hubs
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">
            Explore Individual Pages &amp; Stud Resources
          </h2>
          <p className="text-xs text-gray-600">
            Every category and resource on our site has its own dedicated page with complete specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Breeding Foundation */}
          <Link
            href="/breeding-foundation"
            className="p-6 rounded-2xl bg-gradient-to-b from-white to-[#fcfaf6] border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-xs hover:shadow-[0_12px_30px_rgba(176,141,87,0.22)] hover:-translate-y-1.5 transition-all duration-300 group space-y-3 relative overflow-hidden"
          >
            <div className="h-1.5 w-12 group-hover:w-full bg-gradient-to-r from-[#1c3028] via-[#e5c07b] to-[#1c3028] rounded-full transition-all duration-500 mb-1" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] border border-[#b08d57]/50 flex items-center justify-center font-bold shadow-xs group-hover:shadow-[0_0_20px_rgba(229,192,123,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232320] group-hover:text-[#b08d57] transition-colors">
              Breeding Foundation (36 Cattle)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Registered Micro Heifers (&lt;36&quot;), Miniature Heifers, and Proven Cows in Calf. AHCS &amp; IMCBR genetic registries.
            </p>
            <span className="text-xs font-bold text-[#1c3028] group-hover:text-[#b08d57] flex items-center gap-1.5 transition-colors pt-1">
              <span>Open Breeding Foundation Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#b08d57]" />
            </span>
          </Link>

          {/* Card 2: Paddock Companions */}
          <Link
            href="/paddock-companions"
            className="p-6 rounded-2xl bg-gradient-to-b from-white to-[#fcfaf6] border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-xs hover:shadow-[0_12px_30px_rgba(176,141,87,0.22)] hover:-translate-y-1.5 transition-all duration-300 group space-y-3 relative overflow-hidden"
          >
            <div className="h-1.5 w-12 group-hover:w-full bg-gradient-to-r from-[#1c3028] via-[#e5c07b] to-[#1c3028] rounded-full transition-all duration-500 mb-1" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] border border-[#b08d57]/50 flex items-center justify-center font-bold shadow-xs group-hover:shadow-[0_0_20px_rgba(229,192,123,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232320] group-hover:text-[#b08d57] transition-colors">
              Paddock Pets &amp; Steers (36 Cattle)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Docile halter-trained desexed steers and bottle-fed calves. Gentle lawn mowers for 1 to 5 acre hobby properties.
            </p>
            <span className="text-xs font-bold text-[#1c3028] group-hover:text-[#b08d57] flex items-center gap-1.5 transition-colors pt-1">
              <span>Open Paddock Companions Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#b08d57]" />
            </span>
          </Link>

          {/* Card 3: About Stud & PIC */}
          <Link
            href="/about"
            className="p-6 rounded-2xl bg-gradient-to-b from-white to-[#fcfaf6] border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-xs hover:shadow-[0_12px_30px_rgba(176,141,87,0.22)] hover:-translate-y-1.5 transition-all duration-300 group space-y-3 relative overflow-hidden"
          >
            <div className="h-1.5 w-12 group-hover:w-full bg-gradient-to-r from-[#1c3028] via-[#e5c07b] to-[#1c3028] rounded-full transition-all duration-500 mb-1" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] border border-[#b08d57]/50 flex items-center justify-center font-bold shadow-xs group-hover:shadow-[0_0_20px_rgba(229,192,123,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232320] group-hover:text-[#b08d57] transition-colors">
              About Stud &amp; PIC Biosecurity
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              MHC PTY LTD (Roma QLD 4455, ABN: 23 158 390 973). Learn about our 100% NLIS ear tagging and PIC compliance.
            </p>
            <span className="text-xs font-bold text-[#1c3028] group-hover:text-[#b08d57] flex items-center gap-1.5 transition-colors pt-1">
              <span>Open About Stud Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#b08d57]" />
            </span>
          </Link>

          {/* Card 4: Chondro Genetics */}
          <Link
            href="/chondro-guide"
            className="p-6 rounded-2xl bg-gradient-to-b from-white to-[#fcfaf6] border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-xs hover:shadow-[0_12px_30px_rgba(176,141,87,0.22)] hover:-translate-y-1.5 transition-all duration-300 group space-y-3 relative overflow-hidden"
          >
            <div className="h-1.5 w-12 group-hover:w-full bg-gradient-to-r from-[#1c3028] via-[#e5c07b] to-[#1c3028] rounded-full transition-all duration-500 mb-1" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] border border-[#b08d57]/50 flex items-center justify-center font-bold shadow-xs group-hover:shadow-[0_0_20px_rgba(229,192,123,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232320] group-hover:text-[#b08d57] transition-colors">
              Chondrodysplasia Genetics Guide
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Radical transparency on dwarfism testing. Non-Carrier natural miniature proportions vs Chondro+ carrier breeding safety.
            </p>
            <span className="text-xs font-bold text-[#1c3028] group-hover:text-[#b08d57] flex items-center gap-1.5 transition-colors pt-1">
              <span>Open Chondro Genetics Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#b08d57]" />
            </span>
          </Link>

          {/* Card 5: FAQ */}
          <Link
            href="/faq"
            className="p-6 rounded-2xl bg-gradient-to-b from-white to-[#fcfaf6] border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-xs hover:shadow-[0_12px_30px_rgba(176,141,87,0.22)] hover:-translate-y-1.5 transition-all duration-300 group space-y-3 relative overflow-hidden"
          >
            <div className="h-1.5 w-12 group-hover:w-full bg-gradient-to-r from-[#1c3028] via-[#e5c07b] to-[#1c3028] rounded-full transition-all duration-500 mb-1" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] border border-[#b08d57]/50 flex items-center justify-center font-bold shadow-xs group-hover:shadow-[0_0_20px_rgba(229,192,123,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232320] group-hover:text-[#b08d57] transition-colors">
              Frequently Asked Questions (FAQ)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Acreage minimums, feed requirements, fencing standards, freight transport, and livestock companion requirements.
            </p>
            <span className="text-xs font-bold text-[#1c3028] group-hover:text-[#b08d57] flex items-center gap-1.5 transition-colors pt-1">
              <span>Open Full FAQ Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#b08d57]" />
            </span>
          </Link>

          {/* Card 6: Transport & Livestock Logistics */}
          <Link
            href="/faq"
            className="p-6 rounded-2xl bg-gradient-to-b from-white to-[#fcfaf6] border-2 border-[#e5dec9] hover:border-[#b08d57] shadow-xs hover:shadow-[0_12px_30px_rgba(176,141,87,0.22)] hover:-translate-y-1.5 transition-all duration-300 group space-y-3 relative overflow-hidden"
          >
            <div className="h-1.5 w-12 group-hover:w-full bg-gradient-to-r from-[#1c3028] via-[#e5c07b] to-[#1c3028] rounded-full transition-all duration-500 mb-1" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3028] via-[#244234] to-[#1c3028] text-[#e5c07b] border border-[#b08d57]/50 flex items-center justify-center font-bold shadow-xs group-hover:shadow-[0_0_20px_rgba(229,192,123,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#232320] group-hover:text-[#b08d57] transition-colors">
              Direct Paddock Delivery &amp; Transport
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nationwide certified livestock haulage straight to your gate across QLD, NSW, VIC, and SA with travel health certifications.
            </p>
            <span className="text-xs font-bold text-[#1c3028] group-hover:text-[#b08d57] flex items-center gap-1.5 transition-colors pt-1">
              <span>Read Delivery &amp; Transit Guidelines</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#b08d57]" />
            </span>
          </Link>
        </div>
      </section>

      {/* 6. FAQ Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#b08d57]">
            Care &amp; Land Ownership
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">
            Common Buyer Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.slice(0, 4).map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#e5dec9] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif text-base font-bold text-[#232320] hover:text-[#b08d57] transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#b08d57] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-[#f0ebd9] bg-[#fcfbf9]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b08d57] hover:underline"
          >
            <span>View All 14 Frequently Asked Questions on Dedicated FAQ Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Google Drive Image Sync & WebForge Optimization Modal */}
      <GoogleDriveSyncModal
        isOpen={driveSyncOpen}
        onClose={() => setDriveSyncOpen(false)}
      />
    </div>
  );
}
