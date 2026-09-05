'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimalProduct, CONTACT, SITE } from '@/lib/site-config';
import { X, Heart, ShieldCheck, Ruler, Award, Sparkles, MessageCircle, Download, Info, CheckCircle2, Truck } from 'lucide-react';

interface AnimalModalProps {
  animal: AnimalProduct | null;
  isOpen: boolean;
  onClose: () => void;
  isEnquired: boolean;
  onToggleEnquiry: (animal: AnimalProduct) => void;
}

export default function AnimalModal({
  animal,
  isOpen,
  onClose,
  isEnquired,
  onToggleEnquiry,
}: AnimalModalProps) {
  if (!isOpen || !animal) return null;

  const cryptoPrice = Math.round(animal.price * 0.9);
  const holdingDeposit = Math.round(animal.price * 0.2);

  const whatsappMessage = encodeURIComponent(
    `Hello MHC PTY LTD! I am inquiring about reserving ${animal.name} (${animal.color} ${animal.sizeClass} Highland ${animal.sex}, $${animal.price} AUD). Please send me additional videos and transport quote for our property.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#e5dec9] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: 4:3 Image & Photo Sourcing Specs */}
          <div className="lg:col-span-5 bg-[#fbf9f5] border-r border-[#e5dec9] p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-[#cfc4af]">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 bg-[#232320]/80 text-[#e5c07b] text-[10px] font-bold px-2 py-1 rounded backdrop-blur-xs">
                  {animal.badge || `${animal.sizeClass} Highland`}
                </span>
              </div>
            </div>

            {/* Breeder Health & PIC Compliance */}
            <div className="bg-white p-3.5 rounded-xl border border-[#e5dec9] text-xs space-y-1.5">
              <div className="flex items-center gap-1 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Biosecurity Australia Clearance</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Transferred with official NLIS RFID tag, national vendor declaration (NVD), and full PIC registration assistance.
              </p>
            </div>
          </div>

          {/* Right Column: Animal Profile & Financials */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1c3028] text-[#f4efe6]">
                    {animal.categoryLabel}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#ebdcb9] text-[#554023]">
                    {animal.subcategoryLabel}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">ID: {animal.id}</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#232320]">
                  {animal.name}
                </h2>
                <p className="text-sm font-medium text-[#705d48]">
                  {animal.color} • {animal.sizeClass} Scottish Highland {animal.sex}
                </p>
              </div>

              {/* Price & Deposit Summary */}
              <div className="p-4 bg-[#fbf9f5] rounded-2xl border border-[#e5dec9] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Outright Price (GST Included)</span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1c3028]">
                    ${animal.price.toLocaleString()}{' '}
                    <span className="text-sm font-sans font-normal text-gray-600">AUD</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    10% Crypto Price: ${cryptoPrice.toLocaleString()} AUD in BTC / USDT
                  </p>
                </div>
                <div className="text-right border-l border-[#e5dec9] pl-4">
                  <span className="text-xs text-gray-500 font-medium">Holding Deposit (20%)</span>
                  <div className="text-lg font-bold text-[#b08d57]">
                    ${holdingDeposit.toLocaleString()} AUD
                  </div>
                  <p className="text-[10px] text-gray-500">Refundable prior to transport inspection</p>
                </div>
              </div>

              {/* Biological or Equipment Specs Table */}
              {animal.category === 'care-equipment' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Pack / Dimensions</span>
                    <span className="font-bold text-[#232320] text-sm">{animal.dimensionsOrPack}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Guarantee / Shelf Life</span>
                    <span className="font-bold text-[#232320] text-sm">{animal.warrantyOrShelfLife}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Quality Standard</span>
                    <span className="font-bold text-[#232320] text-sm truncate">{animal.registry || 'MHC Stud Approved'}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3 p-2.5 rounded-xl bg-[#fbf9f5] border border-[#cfc4af]">
                    <span className="text-[#6d4c1b] block text-[10px] uppercase font-bold">Livestock Compatibility & Fit</span>
                    <span className="font-semibold text-xs text-[#232320]">
                      {animal.compatibility}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Biosecurity & Delivery Method</span>
                    <span className="text-gray-700 text-xs">
                      Clean sealed freight direct to your property, or bundled with live cattle transport. No PIC required.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Mature Hip Height</span>
                    <span className="font-bold text-[#232320] text-sm">{animal.heightInches}&quot; ({Math.round((animal.heightInches || 36) * 2.54)} cm)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Age / Stage</span>
                    <span className="font-bold text-[#232320] text-sm">{animal.dobOrAge}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Pedigree Registry</span>
                    <span className="font-bold text-[#232320] text-sm truncate">{animal.registry}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3 p-2.5 rounded-xl bg-[#fbf9f5] border border-[#cfc4af]">
                    <span className="text-[#6d4c1b] block text-[10px] uppercase font-bold">Chondrodysplasia Status</span>
                    <span className={`font-semibold text-xs ${animal.chondroStatus?.includes('Non-Carrier') ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {animal.chondroStatus}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Veterinary & Vaccines</span>
                    <span className="text-gray-700 text-xs">{animal.vaccination}</span>
                  </div>
                </div>
              )}

              {/* Full Description & Overview */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#232320]">
                  {animal.category === 'care-equipment' ? 'Product Specifications & Stud Usage' : 'Breeder Temperament & Overview'}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">{animal.fullDescription}</p>
                {animal.temperament && (
                  <p className="text-xs text-[#705d48] font-medium italic">
                    &ldquo;{animal.temperament}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#e5dec9] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <Link
                href={`/order-now?animal=${animal.id}`}
                onClick={onClose}
                className="py-3 px-5 rounded-xl text-sm font-bold bg-[#1c3028] hover:bg-[#284439] text-[#e5c07b] hover:text-white transition-all shadow-md flex items-center justify-center gap-2 border border-[#b08d57]/40"
              >
                <Truck className="w-4 h-4 text-[#e5c07b]" />
                <span>Order Now (Direct Delivery)</span>
              </Link>

              <button
                onClick={() => onToggleEnquiry(animal)}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                  isEnquired
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#b08d57] text-[#232320] hover:bg-[#977340] hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isEnquired ? 'fill-current' : ''}`} />
                <span>{isEnquired ? 'Reserved in List' : 'Reserve Now'}</span>
              </button>

              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="pt-3 text-center">
              <Link
                href={`/herd/${animal.slug}`}
                onClick={onClose}
                className="text-xs font-semibold text-[#8a6f43] hover:text-[#b08d57] underline underline-offset-2"
              >
                Open {animal.name}&apos;s full page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
