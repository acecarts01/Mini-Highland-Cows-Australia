'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ALL_PRODUCTS,
  AnimalProduct,
  CONTACT,
  SITE,
  SHOP,
  getAnimalOrderSpecs,
} from '@/lib/site-config';
import { submitToReplyPortal } from '@/lib/submit-form';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Ruler,
  Award,
  Phone,
  MessageCircle,
  FileText,
  HelpCircle,
  ArrowRight,
  Coins,
  ChevronDown,
  Info,
} from 'lucide-react';

function OrderNowContent() {
  const searchParams = useSearchParams();
  // Every "Order Now" link site-wide (AnimalCard, AnimalModal) passes the
  // animal's id, e.g. /order-now?animal=mhc-70 — not its slug. This lookup
  // must check both, or every one of those links silently falls through to
  // the mhc-01 default regardless of which product was actually clicked.
  const animalParam = searchParams.get('animal') || searchParams.get('slug');

  const initialAnimal =
    ALL_PRODUCTS.find((p) => p.id === animalParam) ||
    ALL_PRODUCTS.find((p) => p.slug === animalParam) ||
    ALL_PRODUCTS.find((p) => p.id === 'mhc-01') ||
    ALL_PRODUCTS[0];

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalProduct>(initialAnimal);
  const [activeCategory, setActiveCategory] = useState<'all' | 'breeding-foundation' | 'paddock-companions' | 'care-equipment'>('all');
  const [searchFilter, setSearchFilter] = useState('');

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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredAnimals = ALL_PRODUCTS.filter((a) => {
    if (activeCategory !== 'all' && a.category !== activeCategory) return false;
    if (
      searchFilter &&
      !a.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
      (!a.color || !a.color.toLowerCase().includes(searchFilter.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const specs = getAnimalOrderSpecs(selectedAnimal);
  const cryptoPrice = Math.round(selectedAnimal.price * 0.9);
  const depositAmount = Math.round(selectedAnimal.price * 0.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const result = await submitToReplyPortal({
      formType: 'order',
      name: formData.fullName,
      email: formData.email,
      website: formData.website,
      fields: [
        { label: 'Animal', value: `${selectedAnimal.name} (${selectedAnimal.id})` },
        { label: 'Price', value: `$${selectedAnimal.price.toLocaleString()} AUD` },
        { label: 'Full Name', value: formData.fullName },
        { label: 'Phone', value: formData.phone },
        { label: 'Email', value: formData.email },
        {
          label: 'Delivery Address',
          value: `${formData.deliveryAddress}, ${formData.suburbCity} ${formData.state} ${formData.postcode}`,
        },
        {
          label: 'PIC Number',
          value: formData.picNumber || (formData.needPicHelp ? 'Assistance needed' : 'Pending'),
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

  const generateWhatsAppUrl = () => {
    const text = `Hi MHC PTY LTD! I am placing an ORDER for direct paddock shipping to my address:%0A%0A*ANIMAL ORDERED:*%0AName: ${selectedAnimal.name} (ID: ${selectedAnimal.id})%0AEar Tag: ${specs.earTag}%0APrice: $${selectedAnimal.price.toLocaleString()} AUD (Crypto: $${cryptoPrice.toLocaleString()} AUD)%0A%0A*BUYER & PROPERTY ADDRESS:*%0AName: ${formData.fullName || 'Prospective Buyer'}%0APhone: ${formData.phone || 'Pending'}%0AAddress: ${formData.deliveryAddress || ''}, ${formData.suburbCity || ''} ${formData.state} ${formData.postcode || ''}%0APaddock Unloading: ${formData.paddockAccessNotes || 'Standard rural float access'}%0APIC: ${formData.picNumber || (formData.needPicHelp ? 'Please assist me with PIC registration' : 'Pending')}%0APayment: ${formData.paymentMethod}%0A%0A*POLICY CONFIRMATION:*%0AI acknowledge that MHC operates closed-gate biosecurity with zero on-farm public inspections, shipping directly to my nominated address.`;

    return `https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=${text}`;
  };

  const orderFaqs = [
    {
      q: 'Why does MHC not allow on-farm inspections before ordering?',
      a: 'To uphold Australia’s strictest closed-herd biosecurity standards and safeguard young miniature calves from external pathogens (such as Bovine Viral Diarrhea/Pestivirus, Theileria, Johnes Disease, and foot rot), our breeding pastures in Roma operate completely closed-gate. We provide ultra-high-resolution photographs, verified hip height certifications, genetic DNA reports, and comprehensive breeder notes so you can order with absolute confidence.',
    },
    {
      q: 'How does direct door-to-paddock delivery work?',
      a: 'We coordinate with accredited, humane livestock carriers equipped with non-slip bedding, climate-controlled airflow, and low-gradient hydraulic ramps. The transporter delivers the animal directly to your nominated property address or paddock gate, assists with gentle unloading, and hands over all physical NLIS and NVD paperwork.',
    },
    {
      q: 'What paperwork arrives with my miniature cow?',
      a: 'Every animal travels with an official National Vendor Declaration (NVD), pre-transport veterinary health certificate (confirming 7-in-1 vaccines and Pestivirus clear status), and an NLIS RFID ear tag registered to our Roma property, ready for immediate transfer to your property PIC.',
    },
    {
      q: 'What if I don’t have a Property Identification Code (PIC) yet?',
      a: 'Don’t worry! In Australia, hobby farmers with 1 or more acres can easily apply for a PIC through their state department of agriculture (free or under $50). Simply check "I need assistance registering my PIC" on your order, and our livestock administrative team will guide you through the 5-minute online application before delivery.',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Header */}
      <section className="bg-[#1c3028] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#375a4d]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcb9]/20 text-[#e5c07b] text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            100% Direct Paddock Shipping Australia-Wide
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e5c07b] tracking-tight">
            Order Now: Direct Paddock Delivery
          </h1>
          <p className="text-sm sm:text-base text-gray-200 max-w-3xl leading-relaxed">
            Select your miniature or micro Highland cow, review full pedigree and veterinary specs, and submit your desired delivery address. <strong>We do not conduct on-farm inspections</strong>—our strict closed-herd biosecurity protocol ensures your cattle arrive in pristine health, delivered directly to your front gate.
          </p>
        </div>
      </section>

      {/* 2. Biosecurity & Shipping Notice Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-4 sm:p-6 rounded-3xl bg-[#fcf8ed] border border-[#ebdcb9] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ebdcb9] text-[#6d4c1b] flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-sm text-[#1c3028]">
                Closed-Gate Biosecurity Standard (Zero Farm Inspections)
              </h2>
              <p className="text-xs text-gray-700 max-w-3xl leading-relaxed">
                We operate closed-gate breeding paddocks in Roma QLD. We sell strictly by dispatching the animal directly to your property via specialized livestock transport. Every animal is backed by a 100% health guarantee, pre-travel vet clearance, and official NLIS identification.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Shipping Available (72 Cattle)
            </span>
          </div>
        </div>
      </section>

      {/* 3. Main Order Section: Animal Selector + Detailed Specs + Order Form */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 Cols): Animal Selector & Mini Catalog */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-[#e5dec9] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5dec9] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#232320]">
                  1. Select Your Animal ({filteredAnimals.length})
                </h3>
                <span className="text-[11px] text-gray-500 font-medium">Click to choose</span>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeCategory === 'all'
                      ? 'bg-[#1c3028] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All (33)
                </button>
                <button
                  onClick={() => setActiveCategory('breeding-foundation')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeCategory === 'breeding-foundation'
                      ? 'bg-[#1c3028] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Breeding (13)
                </button>
                <button
                  onClick={() => setActiveCategory('paddock-companions')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeCategory === 'paddock-companions'
                      ? 'bg-[#1c3028] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Steers &amp; Calves (10)
                </button>
                <button
                  onClick={() => setActiveCategory('care-equipment')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeCategory === 'care-equipment'
                      ? 'bg-[#1c3028] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Care &amp; Equip (10)
                </button>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search cattle & equipment..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#b08d57] focus:outline-hidden"
              />

              {/* Animal Scroll List */}
              <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                {filteredAnimals.map((animal) => {
                  const isSelected = selectedAnimal.id === animal.id;
                  const itemSpecs = getAnimalOrderSpecs(animal);
                  return (
                    <button
                      key={animal.id}
                      onClick={() => setSelectedAnimal(animal)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#b08d57] bg-[#fbf9f5] ring-2 ring-[#b08d57]/30 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={animal.image}
                          alt={animal.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-1">
                          <h4 className="font-bold text-xs text-[#232320] truncate">
                            {animal.name}
                          </h4>
                          <span className="font-serif font-bold text-xs text-[#1c3028] shrink-0">
                            ${animal.price.toLocaleString()} AUD
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">
                          {animal.category === 'care-equipment'
                            ? `${animal.subcategoryLabel} • ${animal.dimensionsOrPack}`
                            : `${animal.color} • ${animal.sizeClass} (${animal.heightInches}&quot;) • ${itemSpecs.earTag}`}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-medium">
                          <span>Crypto: ${Math.round(animal.price * 0.9).toLocaleString()}</span>
                          <span>• {animal.category === 'care-equipment' ? 'Direct Dispatch' : 'Halter Gentle'}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Support Box */}
            <div className="p-4 bg-[#1c3028] text-white rounded-3xl border border-[#375a4d] space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#e5c07b]">
                <Phone className="w-4 h-4" /> Live Sales &amp; Transport Assistance
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Prefer to discuss freight rates, gate unloading, or PIC transfers before placing your order? Speak directly with our Roma livestock manager.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px]"
                >
                  Call {CONTACT.phone}
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Desk
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Selected Animal Detailed Specs + Order Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Selected Animal Hero Card with Full Specs */}
            <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#e5dec9] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#ebdcb9] text-[#6d4c1b]">
                    {selectedAnimal.category === 'care-equipment' ? 'Selected Equipment Item' : 'Selected Cattle Specimen'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#232320] mt-1">
                    {selectedAnimal.name} ({specs.earTag})
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-2xl text-[#1c3028]">
                    ${selectedAnimal.price.toLocaleString()} AUD
                  </span>
                  <p className="text-xs text-emerald-700 font-bold">
                    Crypto (10% Off): ${cryptoPrice.toLocaleString()} AUD
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                <div className="sm:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-gray-100">
                  <Image
                    src={selectedAnimal.image}
                    alt={selectedAnimal.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                    {selectedAnimal.category === 'care-equipment'
                      ? selectedAnimal.subcategoryLabel
                      : `${selectedAnimal.sizeClass} (${selectedAnimal.heightInches}&quot;)`}
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-2 text-xs text-gray-700">
                  <p className="leading-relaxed">{selectedAnimal.shortDescription}</p>
                  {selectedAnimal.category === 'care-equipment' ? (
                    <div className="p-3 bg-[#fbf9f5] rounded-xl border border-[#e5dec9] text-[11px] space-y-1">
                      <p>
                        <strong>Category &amp; Pack:</strong> {selectedAnimal.subcategoryLabel} • {selectedAnimal.dimensionsOrPack}
                      </p>
                      <p>
                        <strong>Warranty &amp; Shelf Life:</strong> {selectedAnimal.warrantyOrShelfLife}
                      </p>
                      <p>
                        <strong>Compatibility:</strong> {selectedAnimal.compatibility}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#fbf9f5] rounded-xl border border-[#e5dec9] text-[11px] space-y-1">
                      <p>
                        <strong>Color &amp; Sex:</strong> {selectedAnimal.color} • {selectedAnimal.sex}
                      </p>
                      <p>
                        <strong>Age / Stage:</strong> {selectedAnimal.dobOrAge}
                      </p>
                      <p>
                        <strong>Temperament:</strong> {selectedAnimal.temperament}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Order Specifications Table */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#b08d57]" /> Verified Order Specifications &amp; Biosecurity Data
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Ear Tag</span>
                    <strong className="text-[#1c3028] text-xs font-mono">{specs.earTag}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">NLIS Electronic Tag</span>
                    <strong className="text-[#1c3028] text-xs font-mono">{specs.nlisRfid}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">
                      {selectedAnimal.category === 'care-equipment' ? 'Equipment Pack' : 'Mature Hip Height'}
                    </span>
                    <strong className="text-[#1c3028] text-xs">
                      {selectedAnimal.category === 'care-equipment'
                        ? selectedAnimal.dimensionsOrPack
                        : `${selectedAnimal.heightInches}" (${specs.heightCm} cm)`}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Live Weight Est.</span>
                    <strong className="text-[#1c3028] text-xs">
                      ~{specs.estimatedWeightKg} kg ({specs.projectedMatureWeightKg} kg mature)
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Sire Bloodline</span>
                    <span className="text-gray-800 text-[11px] truncate block">{specs.sirePedigree}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Health Status</span>
                    <span className="text-emerald-700 font-bold text-[11px] truncate block">✓ 7-in-1 Vaccinated</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3 p-2.5 rounded-xl bg-[#fcf8ed] border border-[#ebdcb9] text-[11px] text-[#4b4337]">
                    <strong>Freight Timeframe &amp; Delivery:</strong> {specs.shippingTimeframe} directly to your property address. Pre-movement NVD generated.
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Paddock Order Form */}
            <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-[#e5dec9] pb-3">
                <h3 className="font-serif text-xl font-bold text-[#232320]">
                  2. Enter Your Desired Shipping Address
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Complete your property delivery details below. No on-farm inspections are required.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#232320]">
                    Livestock Order Successfully Logged!
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.fullName}</strong>. We have received your order for <strong>{selectedAnimal.name} ({specs.earTag})</strong> to be delivered to <strong>{formData.suburbCity}, {formData.state}</strong>.
                  </p>
                  <div className="p-4 bg-[#fcf8ed] border border-[#ebdcb9] rounded-2xl max-w-md mx-auto text-left text-xs space-y-1.5 text-gray-700">
                    <p className="font-bold text-[#1c3028]">Official Order Dispatch Steps:</p>
                    <p>• Our transit driver coordinates arrival day and gate access.</p>
                    <p>• Official NLIS property transfer paperwork and NVD are prepared.</p>
                    <p>• Pre-delivery holding invoice or crypto address provided.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Instant WhatsApp Confirmation
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-bold text-xs"
                    >
                      Place Another Order
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  {/* Buyer Contact Details */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      A. Buyer Contact
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
                          placeholder="Eleanor Vance"
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
                          placeholder="0412 345 678"
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
                          placeholder="buyer@example.com"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      B. Desired Delivery Address (Direct to Property Gate)
                    </h5>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Street Address or Lot Number / Rural Road *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        placeholder="142 River Gum Way / Lot 5 Mountain View Rd"
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
                          onChange={(e) => setFormData({ ...formData, suburbCity: e.target.value })}
                          placeholder="Maleny / Bowral / Yarra Glen"
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
                        <label className="block text-xs font-bold text-gray-700 mb-1">Postcode *</label>
                        <input
                          type="text"
                          required
                          value={formData.postcode}
                          onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                          placeholder="4552"
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
                        onChange={(e) => setFormData({ ...formData, paddockAccessNotes: e.target.value })}
                        placeholder="Double farm gate on front road; flat gravel area suitable for truck float turning"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#b08d57] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* PIC & Compliance */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      C. Property Identification Code (PIC)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Property PIC
                        </label>
                        <input
                          type="text"
                          disabled={formData.needPicHelp}
                          value={formData.picNumber}
                          onChange={(e) => setFormData({ ...formData, picNumber: e.target.value.toUpperCase() })}
                          placeholder="e.g. QDBB1234"
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
                          <span>I need help registering my free hobby farm PIC</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Payment Preference */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      D. Payment Preference
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
                          ${selectedAnimal.price.toLocaleString()} AUD
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
                        <p className="text-[11px] text-gray-600 mt-1">Instant settlement in BTC, USDT, or ETH.</p>
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

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#1c3028] hover:bg-[#284439] disabled:opacity-60 disabled:cursor-not-allowed text-[#e5c07b] font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4 text-[#e5c07b]" />
                      {submitting ? 'Sending…' : 'Place Order for Direct Paddock Delivery'}
                    </button>

                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Order on WhatsApp Live Desk
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ordering FAQ Accordion */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#b08d57]">
            Delivery &amp; Biosecurity Guidance
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#232320]">
            Frequently Asked Questions About Ordering
          </h3>
        </div>

        <div className="space-y-3">
          {orderFaqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#e5dec9] overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-bold text-[#232320] hover:text-[#b08d57] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#b08d57] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-700 leading-relaxed border-t border-[#f0ebd9] bg-[#fcfbf9]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function OrderNowClient() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading Order Portal...</div>}>
      <OrderNowContent />
    </Suspense>
  );
}
