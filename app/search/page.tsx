'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ALL_PRODUCTS } from '@/lib/site-config';
import AnimalCard from '@/components/AnimalCard';
import { useEnquiry } from '@/lib/enquiry-context';
import { Search, Ruler } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { enquiryList, toggleEnquiry, setInspectedAnimal } = useEnquiry();

  const results = useMemo(() => {
    if (!query.trim()) return ALL_PRODUCTS;
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.color && a.color.toLowerCase().includes(q)) ||
        (a.sizeClass && a.sizeClass.toLowerCase().includes(q)) ||
        (a.sex && a.sex.toLowerCase().includes(q)) ||
        a.categoryLabel.toLowerCase().includes(q) ||
        a.subcategoryLabel.toLowerCase().includes(q) ||
        a.shortDescription.toLowerCase().includes(q) ||
        (a.chondroStatus && a.chondroStatus.toLowerCase().includes(q)) ||
        (a.dimensionsOrPack && a.dimensionsOrPack.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#b08d57]">Home</Link>
          <span>/</span>
          <span className="text-[#232320] font-semibold">Search Miniature Cattle & Equipment</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#232320]">
          Search Mini Highland Cattle & Care Catalog
        </h1>
        <p className="text-sm text-gray-600">
          Search across our verified miniature cattle and premium care equipment by name, color, category, or traits.
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by color (silver, dun, white), sex, size (micro, mini), or name..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-[#d8d0bd] text-sm focus:outline-hidden focus:border-[#b08d57] shadow-xs"
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-4">
          Found <strong>{results.length}</strong> matching miniature cattle
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              isEnquired={enquiryList.some((a) => a.id === animal.id)}
              onToggleEnquiry={toggleEnquiry}
              onInspect={setInspectedAnimal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading catalog search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
