'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  AnimalProduct,
  CONTACT,
  SITE,
  SHOP,
  getAnimalOrderSpecs,
} from '@/lib/site-config';
import { submitToReplyPortal } from '@/lib/submit-form';
import {
  X,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Ruler,
  Award,
  Phone,
  MessageCircle,
  CreditCard,
  Coins,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface OrderModalProps {
  animal: AnimalProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ animal, isOpen, onClose }: OrderModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    suburbCity: '',
    state: 'QLD',
    postcode: '',
    paddockAccessNotes: '',
    picNumber: '',
    needPicHelp: false,
    paymentMethod: 'bank-transfer',
    notes: '',
    website: '', // honeypot — stays blank for real users
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'specs' | 'order'>('order');

  if (!isOpen || !animal) return null;

  const specs = getAnimalOrderSpecs(animal);
  const cryptoPrice = Math.round(animal.price * 0.9);
  const depositAmount = Math.round(animal.price * 0.2);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const result = await submitToReplyPortal({
      formType: 'order',
      name: formData.fullName,
      email: formData.email,
      website: formData.website,
      fields: [
        { label: 'Animal', value: `${animal.name} (${animal.id})` },
        { label: 'Price', value: `$${animal.price.toLocaleString()} AUD` },
        { label: 'Full Name', value: formData.fullName },
        { label: 'Phone', value: formData.phone },
        { label: 'Email', value: formData.email },
        {
          label: 'Delivery Address',
          value: `${formData.deliveryAddress}, ${formData.suburbCity} ${formData.state} ${formData.postcode}`,
        },
        {
          label: 'PIC Number',
          value: formData.picNumber || (formData.needPicHelp ? 'Needs registration help' : 'Pending'),
        },
        { label: 'Payment Method', value: formData.paymentMethod },
        { label: 'Paddock Access Notes', value: formData.paddockAccessNotes },
        { label: 'Additional Notes', value: formData.notes },
      ],
    });

    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(result.message || 'Could not send your order. Please contact us via WhatsApp or phone instead.');
    }
    setSubmitting(false);
  };

  const generateWhatsAppOrderUrl = () => {
    const text = `Hi MHC PTY LTD! I would like to place an immediate ORDER for direct shipping to my property:%0A%0A*ANIMAL DETAILS:*%0AName: ${animal.name} (ID: ${animal.id})%0AEar Tag: ${specs.earTag}%0APrice: $${animal.price.toLocaleString()} AUD (Crypto: $${cryptoPrice.toLocaleString()} AUD)%0A%0A*BUYER & DELIVERY ADDRESS:*%0AName: ${formData.fullName || 'Prospective Buyer'}%0APhone: ${formData.phone || 'Pending'}%0ADelivery Address: ${formData.deliveryAddress || ''}, ${formData.suburbCity || ''} ${formData.state} ${formData.postcode || ''}%0APaddock Unloading Access: ${formData.paddockAccessNotes || 'Standard rural float access'}%0APIC: ${formData.picNumber || (formData.needPicHelp ? 'Please assist me with PIC registration' : 'Pending')}%0APayment Preference: ${formData.paymentMethod}%0A%0A*BIOSECURITY ACKNOWLEDGEMENT:*%0AI understand MHC operates closed-herd biosecurity with zero on-farm inspections, and sells 100% via direct paddock delivery.`;

    return `https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=${text}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#ebdcb9] overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="bg-[#1c3028] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#375a4d]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#b08d57] text-[#232320] flex items-center justify-center font-bold shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#e5c07b]">
                    Direct Paddock Order: {animal.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#375a4d] text-emerald-200">
                    {specs.earTag}
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  100% Direct Shipping to Desired Address • No On-Farm Inspections (Closed Biosecurity)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-[#284439] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Strict Biosecurity Notice Banner */}
          <div className="bg-[#fcf8ed] border-b border-[#ebdcb9] px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-[#6d4c1b]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b08d57] shrink-0" />
              <span>
                <strong>Closed-Herd Protocol:</strong> No on-farm inspections. We sell exclusively by delivering the live animal directly to your nominated address.
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('order')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'order'
                    ? 'bg-[#1c3028] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Order Form
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'specs'
                    ? 'bg-[#1c3028] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Detailed Specs
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#232320]">
                  Order Placed for Direct Shipping!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. We have logged your order for <strong>{animal.name} ({specs.earTag})</strong> with direct delivery to <strong>{formData.suburbCity || 'your property'}</strong>.
                </p>
                <div className="p-4 bg-[#fcf8ed] border border-[#ebdcb9] rounded-2xl max-w-lg mx-auto text-left text-xs space-y-2 text-[#4b4337]">
                  <p className="font-bold text-[#1c3028] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#b08d57]" /> Next Steps in the Transit Dispatch:
                  </p>
                  <p>1. Our livestock coordinator will verify property gate access and confirm your PIC code.</p>
                  <p>2. Pre-departure veterinary health declaration (NVD &amp; 7-in-1 certification) is generated.</p>
                  <p>3. Animal is loaded into our climate-controlled float and delivered to your designated address.</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={generateWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Confirm Instantly on WhatsApp Desk
                  </a>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-bold text-xs transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            ) : activeTab === 'specs' ? (
              /* DETAILED LIVESTOCK SPECS TAB */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-gray-100">
                    <Image
                      src={animal.image}
                      alt={animal.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                      {animal.sizeClass} • {animal.heightInches}&quot; Hip
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-baseline justify-between border-b border-[#ebdcb9] pb-2">
                      <div>
                        <h4 className="font-serif text-2xl font-bold text-[#232320]">
                          {animal.name}
                        </h4>
                        <p className="text-xs text-[#705d48] font-medium">
                          {animal.category === 'care-equipment'
                            ? `${animal.subcategoryLabel} • ${animal.dimensionsOrPack}`
                            : `${animal.color} ${animal.sizeClass} Highland ${animal.sex} (${animal.dobOrAge})`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-2xl font-bold text-[#1c3028]">
                          ${animal.price.toLocaleString()} AUD
                        </span>
                        <p className="text-[10px] text-emerald-700 font-bold">
                          Crypto (10% Off): ${cryptoPrice.toLocaleString()} AUD
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {animal.fullDescription}
                    </p>

                    {animal.category === 'care-equipment' ? (
                      <div className="p-3 bg-[#fcf8ed] rounded-xl border border-[#ebdcb9] text-xs space-y-1">
                        <strong className="text-[#6d4c1b] block">Equipment Specification &amp; Compatibility:</strong>
                        <p className="text-gray-700">{animal.compatibility} • {animal.warrantyOrShelfLife}</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#fcf8ed] rounded-xl border border-[#ebdcb9] text-xs space-y-1">
                        <strong className="text-[#6d4c1b] block">Temperament Guarantee:</strong>
                        <p className="italic text-gray-700">&ldquo;{animal.temperament}&rdquo;</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete Technical Data Table */}
                <div className="space-y-3">
                  <h5 className="font-serif text-base font-bold text-[#232320] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#b08d57]" />{' '}
                    {animal.category === 'care-equipment'
                      ? 'Approved Equipment & Feed Specifications'
                      : 'Complete Livestock Technical & Pedigree Data'}
                  </h5>

                  {animal.category === 'care-equipment' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Item SKU / Reference</span>
                        <strong className="text-[#1c3028] text-sm font-mono">{specs.earTag}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Packaging / Sizing</span>
                        <strong className="text-[#1c3028] text-sm">{animal.dimensionsOrPack}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Warranty / Shelf Life</span>
                        <strong className="text-[#1c3028] text-sm">{animal.warrantyOrShelfLife}</strong>
                      </div>
                      <div className="col-span-1 sm:col-span-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Compatibility</span>
                        <span className="text-gray-800 text-xs font-medium">{animal.compatibility}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Shipping Weight</span>
                        <span className="text-gray-800 text-xs font-medium">~{specs.estimatedWeightKg} kg</span>
                      </div>
                      <div className="col-span-1 sm:col-span-3 p-3 rounded-xl bg-[#fcf8ed] border border-[#ebdcb9]">
                        <span className="text-[#6d4c1b] block text-[10px] uppercase font-bold">
                          Quality Inspection &amp; Freight Guarantee
                        </span>
                        <p className="text-xs text-gray-800 font-medium">
                          {specs.shippingTimeframe} directly to your property or parcel collection.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Official Ear Tag</span>
                        <strong className="text-[#1c3028] text-sm font-mono">{specs.earTag}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">NLIS Electronic RFID</span>
                        <strong className="text-[#1c3028] text-xs font-mono">{specs.nlisRfid}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Mature Hip Height</span>
                        <strong className="text-[#1c3028] text-sm">
                          {animal.heightInches}&quot; ({specs.heightCm} cm)
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Est. Live / Mature Weight</span>
                        <strong className="text-[#1c3028] text-sm">
                          ~{specs.estimatedWeightKg} kg / {specs.projectedMatureWeightKg} kg mature
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Genetic Chondro Status</span>
                        <strong
                          className={`text-xs ${
                            animal.chondroStatus?.includes('Non-Carrier')
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {animal.chondroStatus}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Horn Conformation</span>
                        <strong className="text-[#1c3028] text-xs">{animal.hornStatus}</strong>
                      </div>
                      <div className="col-span-1 sm:col-span-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Sire Lineage</span>
                        <span className="text-gray-800 text-xs font-medium">{specs.sirePedigree}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Dam Lineage</span>
                        <span className="text-gray-800 text-xs font-medium">{specs.damPedigree}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-3 p-3 rounded-xl bg-[#fcf8ed] border border-[#ebdcb9]">
                        <span className="text-[#6d4c1b] block text-[10px] uppercase font-bold">
                          Vaccination &amp; Parasite Protocol
                        </span>
                        <p className="text-xs text-gray-800 font-medium">{specs.vaccinesCurrent}</p>
                        <p className="text-[11px] text-gray-600 mt-0.5">{specs.parasiteProtocol}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setActiveTab('order')}
                    className="px-6 py-2.5 rounded-xl bg-[#b08d57] text-[#232320] font-bold text-xs hover:bg-[#c4a065] transition-colors"
                  >
                    Proceed to Delivery Address &amp; Order Form →
                  </button>
                </div>
              </div>
            ) : (
              /* ORDER FORM TAB */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Honeypot: real visitors never see or fill this in. */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Animal Summary Row */}
                <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#ebdcb9] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={animal.image}
                        alt={animal.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#232320]">{animal.name}</h4>
                      <p className="text-xs text-gray-500">
                        {animal.color} • {animal.sizeClass} ({animal.heightInches}&quot; Hip) • {specs.earTag}
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-[#ebdcb9] sm:pl-4">
                    <span className="text-xs text-gray-500">Order Total (GST Inc.):</span>
                    <div className="font-serif font-bold text-xl text-[#1c3028]">
                      ${animal.price.toLocaleString()} AUD
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Crypto Pay: ${cryptoPrice.toLocaleString()} AUD (-10%)
                    </span>
                  </div>
                </div>

                {/* Section 1: Buyer Information */}
                <div className="space-y-3">
                  <h5 className="font-serif text-sm font-bold text-[#232320] flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#1c3028] text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    Buyer Contact Details
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Telephone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 0412 345 678"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. contact@domain.com"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Desired Shipping Address (No farm inspections) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-serif text-sm font-bold text-[#232320] flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-5 h-5 rounded-full bg-[#1c3028] text-white flex items-center justify-center text-[10px]">
                        2
                      </span>
                      Desired Shipping Address (Direct to Your Property)
                    </h5>
                    <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      ✓ Direct Door-to-Paddock Delivery
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Property Street Address or Lot / Road Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.deliveryAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryAddress: e.target.value })
                        }
                        placeholder="e.g. 142 River Gum Way / Lot 5 Mountain View Rd"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Town / Suburb *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.suburbCity}
                          onChange={(e) =>
                            setFormData({ ...formData, suburbCity: e.target.value })
                          }
                          placeholder="e.g. Maleny / Bowral / Yarra Glen"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden bg-white"
                        >
                          <option value="QLD">Queensland (QLD)</option>
                          <option value="NSW">New South Wales (NSW)</option>
                          <option value="VIC">Victoria (VIC)</option>
                          <option value="SA">South Australia (SA)</option>
                          <option value="WA">Western Australia (WA)</option>
                          <option value="TAS">Tasmania (TAS)</option>
                          <option value="NT">Northern Territory (NT)</option>
                          <option value="ACT">Australian Capital Territory (ACT)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Postcode *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.postcode}
                          onChange={(e) =>
                            setFormData({ ...formData, postcode: e.target.value })
                          }
                          placeholder="e.g. 4552"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Paddock Gate &amp; Truck Unloading Access Instructions
                      </label>
                      <input
                        type="text"
                        value={formData.paddockAccessNotes}
                        onChange={(e) =>
                          setFormData({ ...formData, paddockAccessNotes: e.target.value })
                        }
                        placeholder="e.g. 14ft double gate on front boundary; flat gravel unloading bay; trailer can turn around easily"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: PIC & Biosecurity Protocol */}
                <div className="space-y-3">
                  <h5 className="font-serif text-sm font-bold text-[#232320] flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#1c3028] text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    Property Identification Code (PIC) &amp; NLIS Compliance
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Property PIC (If Known)
                      </label>
                      <input
                        type="text"
                        disabled={formData.needPicHelp}
                        value={formData.picNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, picNumber: e.target.value.toUpperCase() })
                        }
                        placeholder="e.g. QDBB1234 or NA123456"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:border-[#b08d57] focus:outline-hidden disabled:bg-gray-100"
                      />
                    </div>
                    <div className="pt-2 sm:pt-4">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.needPicHelp}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              needPicHelp: e.target.checked,
                              picNumber: e.target.checked ? 'ASSISTANCE REQUIRED' : '',
                            })
                          }
                          className="w-4 h-4 rounded text-[#b08d57] border-gray-300 focus:ring-[#b08d57]"
                        />
                        <span>I don&apos;t have a PIC yet — please help me register free</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 4: Payment Preference */}
                <div className="space-y-3">
                  <h5 className="font-serif text-sm font-bold text-[#232320] flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#1c3028] text-white flex items-center justify-center text-[10px]">
                      4
                    </span>
                    Payment Preference
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label
                      className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                        formData.paymentMethod === 'bank-transfer'
                          ? 'border-[#b08d57] bg-[#fbf9f5] ring-2 ring-[#b08d57]/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#232320]">Bank EFT / PayID</span>
                        <input
                          type="radio"
                          name="payment"
                          value="bank-transfer"
                          checked={formData.paymentMethod === 'bank-transfer'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'bank-transfer' })}
                          className="text-[#b08d57]"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Official corporate invoice sent via MHC PTY LTD.</p>
                      <strong className="text-xs text-[#1c3028] mt-2 block font-serif">
                        ${animal.price.toLocaleString()} AUD
                      </strong>
                    </label>

                    <label
                      className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                        formData.paymentMethod === 'crypto'
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-emerald-600" /> Crypto (-10%)
                        </span>
                        <input
                          type="radio"
                          name="payment"
                          value="crypto"
                          checked={formData.paymentMethod === 'crypto'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'crypto' })}
                          className="text-emerald-700"
                        />
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">Instant settlement via BTC, USDT, or ETH.</p>
                      <strong className="text-xs text-emerald-800 mt-2 block font-serif">
                        ${cryptoPrice.toLocaleString()} AUD
                      </strong>
                    </label>

                    <label
                      className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                        formData.paymentMethod === 'deposit-hold'
                          ? 'border-[#b08d57] bg-[#fbf9f5] ring-2 ring-[#b08d57]/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#232320]">20% Holding Deposit</span>
                        <input
                          type="radio"
                          name="payment"
                          value="deposit-hold"
                          checked={formData.paymentMethod === 'deposit-hold'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'deposit-hold' })}
                          className="text-[#b08d57]"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Lock in animal; balance paid prior to dispatch.</p>
                      <strong className="text-xs text-[#b08d57] mt-2 block font-serif">
                        ${depositAmount.toLocaleString()} AUD
                      </strong>
                    </label>
                  </div>
                </div>

                {/* Final Submit & WhatsApp Buttons */}
                <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#1c3028] hover:bg-[#284439] disabled:opacity-60 disabled:cursor-not-allowed text-[#e5c07b] font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-[#e5c07b]" />
                    {submitting ? 'Sending…' : 'Confirm Order for Direct Shipping'}
                  </button>

                  <a
                    href={generateWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order Direct on WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
