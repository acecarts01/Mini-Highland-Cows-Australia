'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ALL_PRODUCTS, AnimalProduct } from '@/lib/site-config';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnimal: (animal: AnimalProduct) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelectAnimal,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_PRODUCTS.slice(0, 6);
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.color && a.color.toLowerCase().includes(q)) ||
        (a.sizeClass && a.sizeClass.toLowerCase().includes(q)) ||
        (a.sex && a.sex.toLowerCase().includes(q)) ||
        a.subcategoryLabel.toLowerCase().includes(q) ||
        (a.chondroStatus && a.chondroStatus.toLowerCase().includes(q)) ||
        (a.dimensionsOrPack && a.dimensionsOrPack.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#e5dec9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 border-b border-[#e5dec9] flex items-center gap-3 bg-[#fbf9f5]">
          <Search className="w-6 h-6 text-[#b08d57] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search by name, color (Silver, White, Dun), size (Micro, Mini), or sex..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base sm:text-lg text-[#232320] placeholder-gray-400 outline-hidden font-medium"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-[#f4efe6] border-b border-[#e5dec9] flex flex-wrap gap-2 text-xs">
          <span className="text-gray-500 py-1">Popular:</span>
          {['Silver Dun', 'Micro Highland', 'Bottle-Fed Calf', 'White', 'Chondro Negative', 'Pairs'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-[#b08d57] hover:text-white border border-[#cfc4af] text-gray-700 transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No live miniature cattle found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((animal) => (
              <div
                key={animal.id}
                onClick={() => {
                  onSelectAnimal(animal);
                  onClose();
                }}
                className="p-3 hover:bg-[#fbf9f5] rounded-2xl border border-transparent hover:border-[#d6cbba] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                    <Image
                      src={animal.image}
                      alt={animal.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#232320] group-hover:text-[#b08d57] transition-colors truncate">
                        {animal.name}
                      </h4>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#ebdcb9] text-[#554023]">
                        {animal.category === 'care-equipment' ? 'Equipment' : animal.sizeClass}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {animal.category === 'care-equipment'
                        ? `${animal.subcategoryLabel} • ${animal.dimensionsOrPack}`
                        : `${animal.color} Highland ${animal.sex} • Hip: ${animal.heightInches}"`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <div className="font-serif font-bold text-sm text-[#1c3028]">
                      ${animal.price.toLocaleString()} AUD
                    </div>
                    <div className="text-[10px] text-emerald-700">
                      ${Math.round(animal.price * 0.9).toLocaleString()} Crypto
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#b08d57] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
