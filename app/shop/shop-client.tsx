'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ALL_PRODUCTS, AnimalProduct, CATEGORIES, BRANDS } from '@/lib/site-config';
import AnimalCard from '@/components/AnimalCard';
import { useEnquiry } from '@/lib/enquiry-context';
import {
  Sparkles,
  ShieldCheck,
  Filter,
  Search,
  CheckCircle2,
  Truck,
  Award,
  ChevronRight,
  Layers,
  Tag,
  ArrowRight,
} from 'lucide-react';

export interface ShopFilters {
  category: string;
  sub: string;
  brand: string;
  q: string;
}

function ShopContent({ category, sub, brand, q }: ShopFilters) {
  const { enquiryList, toggleEnquiry, setInspectedAnimal } = useEnquiry();

  // Initial filter state comes from the server as props rather than
  // useSearchParams(): reading search params on the client forces this subtree
  // out of the server render, which would leave the product grid — and every
  // link to an animal page — missing from the crawlable HTML.
  const paramCategory = category;
  const paramSub = sub;
  const paramBrand = brand;
  const paramSearch = q;

  // Manual Filter Override States
  const [userCategory, setUserCategory] = useState<string | null>(null);
  const [userSub, setUserSub] = useState<string | null>(null);
  const [userBrand, setUserBrand] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState<string | null>(null);

  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [chondroFilter, setChondroFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Derived active values
  const categoryFilter = userCategory ?? paramCategory;
  const subcategoryFilter = userSub ?? paramSub;
  const brandFilter = userBrand ?? paramBrand;
  const searchTerm = userSearch ?? paramSearch;

  const setCategoryFilter = (val: string) => setUserCategory(val);
  const setSubcategoryFilter = (val: string) => setUserSub(val);
  const setBrandFilter = (val: string) => setUserBrand(val);
  const setSearchTerm = (val: string) => setUserSearch(val);

  // Selected brand object if brandFilter is active
  const activeBrand = useMemo(() => {
    return BRANDS.find((b) => b.slug === brandFilter);
  }, [brandFilter]);

  // Filter Logic across all 72 mini cattle
  const filteredAnimals = useMemo(() => {
    return ALL_PRODUCTS.filter((animal) => {
      // Search term
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

      // Category filter
      if (categoryFilter !== 'all' && animal.category !== categoryFilter) return false;

      // Subcategory filter
      if (subcategoryFilter !== 'all' && animal.subcategory !== subcategoryFilter) return false;

      // Brand filter
      if (brandFilter !== 'all') {
        const targetBrand = BRANDS.find((b) => b.slug === brandFilter);
        if (targetBrand) {
          const regText = targetBrand.registryFilter.toLowerCase();
          const matchesRegistry = animal.registry ? animal.registry.toLowerCase().includes(regText) : false;
          const matchesDesc = animal.fullDescription.toLowerCase().includes(regText) ||
            animal.shortDescription.toLowerCase().includes(regText);
          if (!matchesRegistry && !matchesDesc) {
            // For custom tags like 'highpark' or 'loch-lomond'
            if (brandFilter === 'highpark-pointed' && (!animal.color || (!animal.color.toLowerCase().includes('highpark') && !animal.color.toLowerCase().includes('white')))) {
              return false;
            }
            if (brandFilter === 'loch-lomond-heritage' && !animal.shortDescription.toLowerCase().includes('scottish') && (!animal.registry || !animal.registry.includes('AHCS'))) {
              return false;
            }
            if (brandFilter === 'mhc-signature' && !animal.id.startsWith('mhc')) {
              return false;
            }
          }
        }
      }

      // Size filter
      if (sizeFilter !== 'all' && animal.sizeClass !== sizeFilter) return false;

      // Color filter
      if (colorFilter !== 'all' && (!animal.color || !animal.color.toLowerCase().includes(colorFilter.toLowerCase()))) return false;

      // Chondro filter
      if (chondroFilter === 'non-carrier' && (!animal.chondroStatus || !animal.chondroStatus.includes('Non-Carrier'))) return false;
      if (chondroFilter === 'carrier' && (!animal.chondroStatus || !animal.chondroStatus.includes('Carrier'))) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'height') return (a.heightInches || 0) - (b.heightInches || 0);
      return 0; // default order
    });
  }, [categoryFilter, subcategoryFilter, brandFilter, sizeFilter, colorFilter, chondroFilter, sortBy, searchTerm]);

  const colorOptions = ['Silver', 'White', 'Dun', 'Red', 'Black', 'Brindle', 'Yellow'];

  const resetAllFilters = () => {
    setCategoryFilter('all');
    setSubcategoryFilter('all');
    setBrandFilter('all');
    setSizeFilter('all');
    setColorFilter('all');
    setChondroFilter('all');
    setSearchTerm('');
    setSortBy('featured');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header & Breadcrumbs */}
      <section className="bg-gradient-to-b from-[#ebdcb9]/40 to-transparent pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#b08d57]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#232320] font-semibold">Shop Miniature Highland Cattle</span>
            {categoryFilter !== 'all' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#b08d57] font-semibold capitalize">
                  {categoryFilter.replace('-', ' ')}
                </span>
              </>
            )}
            {brandFilter !== 'all' && activeBrand && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#b08d57] font-semibold">
                  {activeBrand.shortName}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-[#b08d57] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#b08d57]" />
                Official Herd Catalog • MHC PTY LTD (ROMA QLD)
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320]">
                Shop Miniature Highland Cows
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl">
                Browse our verified herd of 100% genuine miniature and micro Scottish Highland cattle. Filter by categories and stud genetics brands below.
              </p>
            </div>

            <Link
              href="/order-now"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c3028] text-[#e5c07b] hover:text-white hover:bg-[#284439] text-sm font-bold transition-all shadow-md shrink-0 border border-[#b08d57]/40"
            >
              <Truck className="w-4 h-4 text-[#e5c07b]" />
              <span>Order Now (Paddock Delivery)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Shop By Category & Brands Quick Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-white rounded-3xl border border-[#e5dec9] shadow-xs space-y-6">
          {/* Shop by Category Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#232320] flex items-center gap-2 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#b08d57]" />
                Shop by Category
              </h2>
              {categoryFilter !== 'all' && (
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setSubcategoryFilter('all');
                  }}
                  className="text-xs text-[#b08d57] hover:underline font-semibold"
                >
                  Clear Category
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setSubcategoryFilter('all');
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-[#1c3028] text-white border-[#1c3028] shadow-sm'
                    : 'bg-[#fbf9f5] border-[#e5dec9] hover:border-[#b08d57] text-[#232320]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">All Cattle</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    categoryFilter === 'all' ? 'bg-[#e5c07b] text-[#1c3028]' : 'bg-[#ebdcb9] text-[#6d4c1b]'
                  }`}>
                    72 Available
                  </span>
                </div>
                <p className={`text-xs mt-1 line-clamp-1 ${categoryFilter === 'all' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Complete stud herd: heifers, cows in calf, steers &amp; calves.
                </p>
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategoryFilter(cat.id);
                      setSubcategoryFilter('all');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#1c3028] text-white border-[#1c3028] shadow-sm'
                        : 'bg-[#fbf9f5] border-[#e5dec9] hover:border-[#b08d57] text-[#232320]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{cat.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-[#e5c07b] text-[#1c3028]' : 'bg-[#ebdcb9] text-[#6d4c1b]'
                      }`}>
                        {cat.id === 'breeding-foundation' ? '36 Head' : '36 Head'}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                      {cat.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shop by Brands / Stud Genetics */}
          <div className="pt-4 border-t border-[#e5dec9]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#232320] flex items-center gap-2 uppercase tracking-wider">
                <Tag className="w-4 h-4 text-[#b08d57]" />
                Shop by Brands &amp; Bloodlines
              </h2>
              {brandFilter !== 'all' && (
                <button
                  onClick={() => setBrandFilter('all')}
                  className="text-xs text-[#b08d57] hover:underline font-semibold"
                >
                  Clear Brand Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {BRANDS.map((brand) => {
                const isSelected = brandFilter === brand.slug;
                return (
                  <button
                    key={brand.id}
                    onClick={() => setBrandFilter(isSelected ? 'all' : brand.slug)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#b08d57] text-white border-[#b08d57] shadow-sm font-bold'
                        : 'bg-[#fbf9f5] border-[#e5dec9] hover:border-[#b08d57] text-[#232320]'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-white' : 'text-[#b08d57]'}`}>
                      {brand.badge}
                    </span>
                    <span className="text-xs font-bold block leading-tight mt-0.5 truncate">
                      {brand.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter Bar & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e5dec9] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, color (Silver, White, Dun), ear tag, pedigree..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e5dec9] text-xs sm:text-sm focus:outline-none focus:border-[#b08d57] bg-[#fbf9f5]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick stats & reset */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
              <span className="text-gray-600 font-medium">
                Showing <strong className="text-[#232320]">{filteredAnimals.length}</strong> of 72 cattle
              </span>
              <button
                onClick={resetAllFilters}
                className="text-[#b08d57] hover:underline font-bold"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Subcategory & Filter pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f4efe6]">
            {/* Size filter */}
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-[#e5dec9] text-xs font-medium bg-[#fbf9f5] text-[#232320] focus:outline-none focus:border-[#b08d57]"
            >
              <option value="all">All Sizes</option>
              <option value="Micro">Micro (&le;36 inches)</option>
              <option value="Miniature">Miniature (36-42 inches)</option>
            </select>

            {/* Color filter */}
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-[#e5dec9] text-xs font-medium bg-[#fbf9f5] text-[#232320] focus:outline-none focus:border-[#b08d57]"
            >
              <option value="all">All Coat Colors</option>
              {colorOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Chondro genetics filter */}
            <select
              value={chondroFilter}
              onChange={(e) => setChondroFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-[#e5dec9] text-xs font-medium bg-[#fbf9f5] text-[#232320] focus:outline-none focus:border-[#b08d57]"
            >
              <option value="all">Chondro Genetics: Any</option>
              <option value="non-carrier">DNA Tested Non-Carrier (Negative)</option>
              <option value="carrier">Chondro+ (Carrier Dwarfism)</option>
            </select>

            {/* Sort order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-[#e5dec9] text-xs font-medium bg-[#fbf9f5] text-[#232320] focus:outline-none focus:border-[#b08d57] ml-auto"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="height">Height: Smallest First</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Active Filters Bar */}
      {(categoryFilter !== 'all' || brandFilter !== 'all' || sizeFilter !== 'all' || colorFilter !== 'all' || chondroFilter !== 'all' || searchTerm) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium">Active Filters:</span>
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1c3028] text-white font-medium">
                Category: {categoryFilter}
                <button onClick={() => setCategoryFilter('all')} className="hover:text-[#e5c07b]">×</button>
              </span>
            )}
            {brandFilter !== 'all' && activeBrand && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#b08d57] text-white font-medium">
                Brand: {activeBrand.shortName}
                <button onClick={() => setBrandFilter('all')} className="hover:text-[#232320]">×</button>
              </span>
            )}
            {sizeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] font-medium">
                Size: {sizeFilter}
                <button onClick={() => setSizeFilter('all')} className="hover:text-black">×</button>
              </span>
            )}
            {colorFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] font-medium">
                Color: {colorFilter}
                <button onClick={() => setColorFilter('all')} className="hover:text-black">×</button>
              </span>
            )}
            {chondroFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] font-medium">
                Chondro: {chondroFilter}
                <button onClick={() => setChondroFilter('all')} className="hover:text-black">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-200 text-gray-800 font-medium">
                &ldquo;{searchTerm}&rdquo;
                <button onClick={() => setSearchTerm('')} className="hover:text-black">×</button>
              </span>
            )}
          </div>
        </section>
      )}

      {/* 5. Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredAnimals.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-[#e5dec9] p-8">
            <Filter className="w-12 h-12 text-[#b08d57] mx-auto opacity-50" />
            <h3 className="font-serif text-xl font-bold text-[#232320]">No cattle match your selected filters</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Try relaxing your search terms, coat color, or brand filters to view available miniature Highland stock.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 rounded-full bg-[#b08d57] text-white font-bold text-sm hover:bg-[#977340] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnimals.map((animal) => {
              const isEnquired = enquiryList.some((a) => a.id === animal.id);
              return (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  isEnquired={isEnquired}
                  onToggleEnquiry={toggleEnquiry}
                  onInspect={setInspectedAnimal}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Order Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#1c3028] text-white border border-[#375a4d] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-[#e5c07b] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#e5c07b]" />
              Direct Nationwide Livestock Delivery • Zero Farm Inspections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Ready to Welcome a Miniature Highland to Your Paddock?
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Place your order directly online. Our team coordinates buyer Property Identification Code (PIC) checks, electronic NLIS transfers, and stress-free paddock delivery.
            </p>
          </div>

          <Link
            href="/order-now"
            className="px-8 py-4 rounded-full bg-[#e5c07b] hover:bg-[#d4af37] text-[#232320] font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 shrink-0"
          >
            <Truck className="w-4 h-4 text-[#232320]" />
            <span>Order Now Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function ShopClient(props: ShopFilters) {
  return <ShopContent {...props} />;
}
