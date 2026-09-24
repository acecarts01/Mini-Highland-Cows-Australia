'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ALL_PRODUCTS, AnimalProduct, CATEGORIES } from '@/lib/site-config';
import AnimalCard from '@/components/AnimalCard';
import { useEnquiry } from '@/lib/enquiry-context';
import {
  Ruler,
  Sparkles,
  ShieldCheck,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Heart,
  Info,
} from 'lucide-react';

export default function HerdClient() {
  const { enquiryList, toggleEnquiry, setInspectedAnimal } = useEnquiry();

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [chondroFilter, setChondroFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter Logic across all 72 mini cattle
  const filteredAnimals = useMemo(() => {
    return ALL_PRODUCTS.filter((animal) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          animal.name.toLowerCase().includes(query) ||
          (animal.color && animal.color.toLowerCase().includes(query)) ||
          animal.categoryLabel.toLowerCase().includes(query) ||
          animal.shortDescription.toLowerCase().includes(query) ||
          (animal.registry && animal.registry.toLowerCase().includes(query));
        if (!matches) return false;
      }
      if (categoryFilter !== 'all' && animal.category !== categoryFilter) return false;
      if (subcategoryFilter !== 'all' && animal.subcategory !== subcategoryFilter) return false;
      if (sizeFilter !== 'all' && animal.sizeClass !== sizeFilter) return false;
      if (colorFilter !== 'all' && (!animal.color || !animal.color.toLowerCase().includes(colorFilter.toLowerCase()))) return false;
      if (chondroFilter === 'non-carrier' && (!animal.chondroStatus || !animal.chondroStatus.includes('Non-Carrier'))) return false;
      if (chondroFilter === 'carrier' && (!animal.chondroStatus || !animal.chondroStatus.includes('Carrier'))) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'height') return (a.heightInches || 0) - (b.heightInches || 0);
      return 0; // default order
    });
  }, [categoryFilter, subcategoryFilter, sizeFilter, colorFilter, chondroFilter, sortBy, searchTerm]);

  const colorOptions = ['Silver', 'White', 'Dun', 'Red', 'Black', 'Brindle', 'Yellow', 'Brown'];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#b08d57]">Home</Link>
          <span>/</span>
          <span className="text-[#232320] font-semibold">Available Herd (72 Live Cattle)</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5dec9] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] text-xs font-bold uppercase tracking-wider mb-2">
              <Ruler className="w-3.5 h-3.5" />
              100% Genuine Mini & Micro Scottish Highland Cattle
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320]">
              Available Mini Highland Herd (72)
            </h1>
            <p className="text-sm sm:text-base text-[#605545] max-w-2xl mt-2 leading-relaxed">
              Browse our complete Roma stud inventory of 72 live miniature and micro Scottish Highland cattle. 
              <strong> We sell strictly miniature cattle (mature height under 42 inches)—never standard or big commercial cows.</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/breeding-foundation"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#cfc4af] hover:border-[#b08d57] text-[#40382d] transition-colors"
            >
              Breeding Heifers (36)
            </Link>
            <Link
              href="/paddock-companions"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#cfc4af] hover:border-[#b08d57] text-[#40382d] transition-colors"
            >
              Paddock Steers & Pets (36)
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e5dec9] p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, color, tag, or trait..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fcfbf9] border border-[#d8d0bd] text-xs focus:outline-hidden focus:border-[#b08d57]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="herd-sort-by" className="text-gray-500 font-medium">Sort by:</label>
            <select
              id="herd-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-[#d8d0bd] bg-[#fcfbf9] text-xs text-[#232320]"
            >
              <option value="featured">Featured Order</option>
              <option value="height">Hip Height: Micro First (&lt;34&quot;)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#f0ebd9] text-xs">
          <div>
            <label htmlFor="herd-cat-filter" className="block text-[11px] font-bold text-gray-500 mb-1">HERD CATEGORY</label>
            <select
              id="herd-cat-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubcategoryFilter('all');
              }}
              className="w-full py-1.5 px-2.5 rounded-lg border border-[#d8d0bd] bg-[#fcfbf9]"
            >
              <option value="all">All Categories (72)</option>
              <option value="breeding-foundation">Breeding Foundation (36)</option>
              <option value="paddock-companions">Paddock Companions (36)</option>
            </select>
          </div>

          <div>
            <label htmlFor="herd-size-filter" className="block text-[11px] font-bold text-gray-500 mb-1">MATURE SIZE CLASS</label>
            <select
              id="herd-size-filter"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg border border-[#d8d0bd] bg-[#fcfbf9]"
            >
              <option value="all">All Sizes (&lt;42&quot;)</option>
              <option value="Micro">Micro (&lt;36&quot; Mature Height)</option>
              <option value="Miniature">Miniature (36&quot;–42&quot; Mature Height)</option>
            </select>
          </div>

          <div>
            <label htmlFor="herd-color-filter" className="block text-[11px] font-bold text-gray-500 mb-1">COAT COLOR</label>
            <select
              id="herd-color-filter"
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg border border-[#d8d0bd] bg-[#fcfbf9]"
            >
              <option value="all">All Colors</option>
              {colorOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="herd-chondro-filter" className="block text-[11px] font-bold text-gray-500 mb-1">CHONDRO STATUS</label>
            <select
              id="herd-chondro-filter"
              value={chondroFilter}
              onChange={(e) => setChondroFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg border border-[#d8d0bd] bg-[#fcfbf9]"
            >
              <option value="all">All Genetic Statuses</option>
              <option value="non-carrier">Non-Carrier (Negative)</option>
              <option value="carrier">Chondro+ (Carrier Dwarfism)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>Showing <strong>{filteredAnimals.length}</strong> of 72 live miniature cattle</span>
          {(categoryFilter !== 'all' || sizeFilter !== 'all' || colorFilter !== 'all' || chondroFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSubcategoryFilter('all');
                setSizeFilter('all');
                setColorFilter('all');
                setChondroFilter('all');
                setSearchTerm('');
              }}
              className="text-[#b08d57] font-semibold hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid (All 72 or filtered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAnimals.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            isEnquired={enquiryList.some((a) => a.id === animal.id)}
            onToggleEnquiry={toggleEnquiry}
            onInspect={setInspectedAnimal}
          />
        ))}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e5dec9] p-8 space-y-4">
          <p className="text-gray-500 text-sm">No miniature cattle match your current filter criteria.</p>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setSizeFilter('all');
              setColorFilter('all');
              setChondroFilter('all');
              setSearchTerm('');
            }}
            className="px-5 py-2.5 rounded-full bg-[#b08d57] text-[#232320] font-bold text-xs hover:bg-[#977340] hover:text-white"
          >
            Clear Filters & View All 72 Animals
          </button>
        </div>
      )}

      {/* Biosecurity & Trust Banner */}
      <div className="bg-[#243e34] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#375a4d]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-[#e5c07b] text-xs font-bold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            Mandatory Live Animal Transfer Compliance
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Purchasing Live Miniature Highland Cattle in Australia
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            All livestock transactions require an active Property Identification Code (PIC). We supply free PIC guidance, official National Vendor Declaration (NVD) paperwork, and pre-departure NLIS electronic ear-tag registration transfer.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-full bg-[#b08d57] hover:bg-[#c4a065] text-[#232320] font-bold text-sm shrink-0 transition-colors shadow-md"
        >
          Enquire About Delivery & PIC →
        </Link>
      </div>
    </div>
  );
}
