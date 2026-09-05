'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/lib/site-config';
import AnimalCard from '@/components/AnimalCard';
import { useEnquiry } from '@/lib/enquiry-context';
import { Award, ShieldCheck, Ruler, Sparkles, Filter } from 'lucide-react';

export default function BreedingFoundationClient() {
  const { enquiryList, toggleEnquiry, setInspectedAnimal } = useEnquiry();
  const [sizeFilter, setSizeFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');

  const breedingAnimals = ALL_PRODUCTS.filter(
    (a) => a.category === 'breeding-foundation'
  ).filter((a) => {
    if (sizeFilter !== 'all' && a.sizeClass !== sizeFilter) return false;
    if (colorFilter !== 'all' && (!a.color || !a.color.toLowerCase().includes(colorFilter.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#b08d57]">Home</Link>
        <span>/</span>
        <Link href="/herd" className="hover:text-[#b08d57]">Available Herd</Link>
        <span>/</span>
        <span className="text-[#232320] font-semibold">Breeding Foundation</span>
      </div>

      {/* Hero Header */}
      <div className="bg-[#1c3028] text-white rounded-3xl p-6 sm:p-10 border border-[#375a4d] relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#345145] text-[#e5c07b] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Registered Genetics & Micro Heifers
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Breeding Foundation Cattle
          </h1>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            High-pedigree micro heifers (&lt;36&quot;), miniature registered heifers, and proven cows in calf. 
            <strong> We breed and sell ONLY true miniature Scottish Highland cattle (never standard or big cattle)</strong>, 
            carefully selected across generations for exceptional maternal instincts, gentle horn growth, dense woolly coats, and DNA-verified genetics.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#e5c07b] pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> AHCS / IMCBR Breed Registered
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler className="w-4 h-4" /> Strictly Mature Hip Heights 32&quot;–40&quot;
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Rare Silver, White, Dun & Red Lines
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e5dec9] shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-600">Filter Breeding Stock:</span>
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-[#d8d0bd] bg-[#fcfbf9]"
          >
            <option value="all">All Sizes</option>
            <option value="Micro">Micro (&lt;36&quot; Hip Height)</option>
            <option value="Miniature">Miniature (36&quot;–42&quot; Hip Height)</option>
          </select>

          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-[#d8d0bd] bg-[#fcfbf9]"
          >
            <option value="all">All Colors</option>
            <option value="Silver">Silver</option>
            <option value="White">White</option>
            <option value="Dun">Dun</option>
            <option value="Red">Red</option>
            <option value="Black">Black</option>
          </select>
        </div>

        <div className="text-gray-500">
          Showing <strong>{breedingAnimals.length}</strong> registered breeding foundation females & pairs
        </div>
      </div>

      {/* Cattle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {breedingAnimals.map((animal) => (
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
  );
}
