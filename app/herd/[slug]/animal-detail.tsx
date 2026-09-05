'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimalProduct, CONTACT } from '@/lib/site-config';
import { useEnquiry } from '@/lib/enquiry-context';
import {
  Ruler,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Check,
  MessageCircle,
  Phone,
  ArrowLeft,
  Truck,
  Info,
} from 'lucide-react';

interface AnimalDetailProps {
  animal: AnimalProduct;
}

export default function AnimalDetail({ animal }: AnimalDetailProps) {
  const { enquiryList, toggleEnquiry, setInspectedAnimal } = useEnquiry();

  const isEnquired = enquiryList.some((a) => a.id === animal.id);
  const cryptoPrice = Math.round(animal.price * 0.9);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#b08d57]">Home</Link>
        <span>/</span>
        <Link href="/herd" className="hover:text-[#b08d57]">Available Herd</Link>
        <span>/</span>
        <Link
          href={
            animal.category === 'breeding-foundation'
              ? '/breeding-foundation'
              : animal.category === 'paddock-companions'
                ? '/paddock-companions'
                : '/shop'
          }
          className="hover:text-[#b08d57]"
        >
          {animal.categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-[#232320] font-semibold">{animal.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Photos & Visual Specs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-[#f8f5ee] rounded-3xl overflow-hidden border border-[#e5dec9] shadow-sm">
            <Image
              src={animal.image}
              alt={`${animal.name} - ${animal.color} ${animal.sizeClass} Miniature Highland ${animal.sex}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {animal.badge && (
                <span className="bg-[#232320]/90 backdrop-blur-xs text-[#e5c07b] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-[#e5c07b]/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  {animal.badge}
                </span>
              )}
              {animal.category === 'care-equipment' ? (
                <span className="text-xs font-semibold px-3 py-1 rounded-full shadow-sm bg-blue-900/90 text-blue-100 border border-blue-400/40">
                  {animal.subcategoryLabel}
                </span>
              ) : (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                    animal.sizeClass === 'Micro'
                      ? 'bg-purple-900/90 text-purple-100 border border-purple-400/40'
                      : 'bg-emerald-900/90 text-emerald-100 border border-emerald-400/40'
                  }`}
                >
                  {animal.sizeClass} Highland ({animal.heightInches}&quot; Mature Height)
                </span>
              )}
            </div>

            {/* Chondro or Equipment Indicator Ribbon */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs font-medium px-3 py-2 rounded-xl bg-black/70 backdrop-blur-xs text-white">
              <span>
                {animal.category === 'care-equipment' ? (
                  <span className="text-blue-300 font-semibold">✓ {animal.warrantyOrShelfLife}</span>
                ) : animal.chondroStatus?.includes('Non-Carrier') ? (
                  <span className="text-emerald-300 font-semibold">✓ Non-Chondro Tested (Negative)</span>
                ) : (
                  <span className="text-amber-300 font-semibold">⚡ Chondro+ Dwarfism Carrier</span>
                )}
              </span>
              <span className="text-gray-300">{animal.dobOrAge || animal.dimensionsOrPack}</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase / Enquiry Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#ebdcb9] text-[#6d4c1b] text-[11px] font-bold uppercase tracking-wider mb-2">
                {animal.category === 'care-equipment' ? 'MHC Approved Stud Equipment' : '100% True Mini Highland Cattle'}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#232320]">
                {animal.name}
              </h1>
              <p className="text-sm text-[#705d48] font-medium mt-1">
                {animal.category === 'care-equipment'
                  ? `${animal.subcategoryLabel} • ${animal.dimensionsOrPack}`
                  : `${animal.color} • ${animal.sizeClass} ${animal.sex}`}
              </p>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#e8e2d2] flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 font-medium">
                  {animal.category === 'care-equipment' ? 'Price (GST Included)' : 'Outright Live Cattle Price'}
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1c3028]">
                  ${animal.price.toLocaleString()} <span className="text-xs font-sans text-gray-500">AUD inc GST</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  10% Crypto Discount
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  ${cryptoPrice.toLocaleString()} AUD in BTC/USDT
                </div>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {animal.category === 'care-equipment' ? 'Equipment & Supply Specifications' : 'Livestock & Biological Specifications'}
              </h2>
              {animal.category === 'care-equipment' ? (
                <div className="grid grid-cols-2 gap-2.5 text-xs text-[#232320]">
                  <div className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Pack / Specs</span>
                    <strong className="text-sm text-[#1c3028]">{animal.dimensionsOrPack}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Warranty / Guarantee</span>
                    <strong className="text-sm text-[#1c3028]">{animal.warrantyOrShelfLife}</strong>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Compatibility</span>
                    <span className="font-medium text-gray-800">{animal.compatibility}</span>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Standard & Registry</span>
                    <span className="font-medium text-gray-800">{animal.registry || 'Australian Made & Quality Inspected'}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 text-xs text-[#232320]">
                  <div className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Mature Hip Height</span>
                    <strong className="text-sm text-[#1c3028]">{animal.heightInches}&quot; (Under 100cm)</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Size Class</span>
                    <strong className="text-sm text-[#1c3028]">{animal.sizeClass} Highland</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Horn Status</span>
                    <span className="font-medium text-gray-800">{animal.hornStatus}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Breed Registry</span>
                    <span className="font-medium text-gray-800">{animal.registry}</span>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Chondrodysplasia Genetics</span>
                    <span className="font-medium text-gray-800">{animal.chondroStatus}</span>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e8e2d2]">
                    <span className="block text-[10px] text-gray-500 uppercase font-semibold">Vaccination & Health</span>
                    <span className="font-medium text-gray-800">{animal.vaccination}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Breeder Notes</h2>
              <p className="text-xs text-gray-700 leading-relaxed">
                {animal.fullDescription}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => toggleEnquiry(animal)}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isEnquired
                    ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                    : 'bg-[#b08d57] text-[#232320] hover:bg-[#977340] hover:text-white'
                }`}
              >
                {isEnquired ? (
                  <>
                    <Check className="w-4 h-4" />
                    In Your Reservation Enquiry Basket
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Add {animal.name} to Enquiry / Hold Basket
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                  `Hi MHC PTY LTD, I am interested in reserving ${animal.name} (ID: ${animal.id}, $${animal.price} AUD). Can you provide details on transport to my PIC?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-2xl font-semibold text-xs border border-emerald-700 text-emerald-800 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Reserve Directly on WhatsApp
              </a>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e5dec9] text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#232320]">
              <Truck className="w-4 h-4 text-[#b08d57]" />
              Humane Paddock-to-Paddock Transport
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              We arrange specialized livestock haulage across Queensland, New South Wales, Victoria, South Australia, and Australia-wide. Orders over $2,000 qualify for free freight subsidy credits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
