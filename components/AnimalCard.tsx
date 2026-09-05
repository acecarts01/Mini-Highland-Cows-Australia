'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { AnimalProduct } from '@/lib/site-config';
import { Heart, Check, Sparkles, Ruler, Award, FileSearch, Info, Truck } from 'lucide-react';

interface AnimalCardProps {
  animal: AnimalProduct;
  isEnquired: boolean;
  onToggleEnquiry: (animal: AnimalProduct) => void;
  onInspect: (animal: AnimalProduct) => void;
}

export default function AnimalCard({
  animal,
  isEnquired,
  onToggleEnquiry,
  onInspect,
}: AnimalCardProps) {
  const cryptoPrice = Math.round(animal.price * 0.9);

  return (
    <motion.article
      id={`animal-${animal.slug}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-2xl border border-[#e5dec9] shadow-xs hover:shadow-2xl hover:border-[#b08d57]/70 transition-all duration-300 flex flex-col overflow-hidden relative cursor-default"
    >
      {/* 4:3 Image Frame */}
      <div className="relative aspect-[4/3] bg-[#f8f5ee] overflow-hidden">
        <motion.div
          className="w-full h-full relative cursor-pointer"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          onClick={() => onInspect(animal)}
        >
          <Image
            src={animal.image}
            alt={`${animal.name} - ${animal.color} ${animal.sizeClass} Miniature Highland ${animal.sex}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient scrim on hover for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </motion.div>

        {/* Top Badges with Hover Micro-Interactions */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {animal.badge && (
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.06, y: -1 }}
              transition={{ delay: 0.05, duration: 0.2 }}
              className="bg-[#232320]/90 backdrop-blur-xs text-[#e5c07b] text-xs font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 border border-[#e5c07b]/40 pointer-events-auto cursor-default"
            >
              <Sparkles className="w-3 h-3 text-[#e5c07b] animate-pulse" />
              {animal.badge}
            </motion.span>
          )}
          {animal.category === 'care-equipment' ? (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs bg-amber-900/90 text-amber-100 border border-amber-400/40 pointer-events-auto cursor-default"
            >
              {animal.itemType === 'feed' ? 'Premium Feed' : 'Pro Equipment'}
            </motion.span>
          ) : (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs pointer-events-auto cursor-default ${
                animal.sizeClass === 'Micro'
                  ? 'bg-purple-900/90 text-purple-100 border border-purple-400/40'
                  : 'bg-emerald-900/90 text-emerald-100 border border-emerald-400/40'
              }`}
            >
              {animal.sizeClass} ({animal.heightInches}&quot;)
            </motion.span>
          )}
        </div>

        {/* Quick Enquiry Heart Button with Spring Animation */}
        <motion.button
          whileHover={{ scale: 1.18, rotate: -4 }}
          whileTap={{ scale: 0.88, rotate: 6 }}
          transition={{ type: 'spring', stiffness: 450, damping: 17 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleEnquiry(animal);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-colors shadow-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#b08d57] ${
            isEnquired
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white/85 backdrop-blur-xs text-gray-700 hover:bg-white hover:text-red-500'
          }`}
          aria-label={isEnquired ? 'Remove from order' : 'Add to order'}
          title={isEnquired ? 'In your order list' : 'Add to order list'}
        >
          <motion.div
            animate={isEnquired ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.28, type: 'spring' }}
          >
            <Heart className={`w-4 h-4 ${isEnquired ? 'fill-current' : ''}`} />
          </motion.div>
        </motion.button>

        {/* Bottom Image Ribbon */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-medium px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-xs text-white z-10">
          <span className="truncate">
            {animal.category === 'care-equipment' ? (
              <span className="text-amber-200 font-semibold">★ {animal.registry || 'MHC Stud Standard'}</span>
            ) : animal.chondroStatus?.includes('Non-Carrier') ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <span>✓</span> Non-Chondro Tested
              </span>
            ) : (
              <span className="text-amber-300 font-semibold flex items-center gap-1">
                <span>⚡</span> Chondro+ Dwarf Carrier
              </span>
            )}
          </span>
          <span className="text-gray-300 shrink-0 ml-1">
            {animal.category === 'care-equipment' ? (animal.warrantyOrShelfLife || 'Direct Dispatch') : animal.dobOrAge}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#232320] group-hover:text-[#b08d57] transition-colors">
                {animal.name}
              </h3>
              <p className="text-xs text-[#705d48] font-medium">
                {animal.category === 'care-equipment'
                  ? `${animal.subcategoryLabel} • ${animal.registry || 'Australian Standard'}`
                  : `${animal.color} • ${animal.sex}`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg sm:text-xl font-bold font-serif text-[#1c3028]">
                ${animal.price.toLocaleString()} <span className="text-xs font-sans text-gray-500">AUD</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium tracking-tight">
                ${cryptoPrice.toLocaleString()} AUD in BTC/USDT (-10%)
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {animal.shortDescription}
          </p>

          {/* Trait or Equipment Tags */}
          <div className="mt-3 pt-3 border-t border-[#f0ebd9] grid grid-cols-2 gap-1.5 text-[11px] text-[#4b4337]">
            {animal.category === 'care-equipment' ? (
              <>
                <div className="flex items-center gap-1 col-span-2">
                  <Ruler className="w-3 h-3 text-[#b08d57] shrink-0" />
                  <span className="truncate">{animal.dimensionsOrPack}</span>
                </div>
                <div className="flex items-center gap-1 col-span-2 text-gray-600 text-[10px]">
                  <Award className="w-3 h-3 text-[#b08d57] shrink-0" />
                  <span className="truncate">{animal.compatibility}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <Ruler className="w-3 h-3 text-[#b08d57]" />
                  <span className="truncate">Hip: {animal.heightInches}&quot; (Mature)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#b08d57]" />
                  <span className="truncate">{animal.registry}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1 text-gray-500 text-[10px] truncate">
                  <Info className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate">{animal.hornStatus}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card Actions: Both Order Now and Reserve Now */}
        <div className="pt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              className="flex-1"
            >
              <Link
                href={`/order-now?animal=${animal.id}`}
                className="w-full py-2 px-3 rounded-xl bg-[#1c3028] hover:bg-[#284439] text-[#e5c07b] hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md border border-[#b08d57]/40"
              >
                <Truck className="w-3.5 h-3.5 text-[#e5c07b]" />
                <span>Order Now</span>
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              onClick={() => onToggleEnquiry(animal)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs hover:shadow-md ${
                isEnquired
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                  : 'bg-[#b08d57] text-[#232320] hover:bg-[#977340] hover:text-white'
              }`}
            >
              {isEnquired ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added
                </>
              ) : (
                animal.category === 'care-equipment' ? 'Add to Order' : 'Reserve Now'
              )}
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#fcfaf6', borderColor: '#b08d57' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            onClick={() => onInspect(animal)}
            className="w-full py-2 px-3 border border-[#cfc4af] rounded-lg text-[11px] font-semibold text-[#40382d] hover:text-[#232320] transition-colors flex items-center justify-center gap-1 shadow-2xs"
          >
            <FileSearch className="w-3.5 h-3.5 text-[#b08d57]" />
            {animal.category === 'care-equipment' ? 'View Full Product & Freight Specs' : 'View Full Specs & NLIS Ear Tag'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
