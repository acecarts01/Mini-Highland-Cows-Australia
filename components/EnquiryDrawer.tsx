'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimalProduct, CONTACT, SHOP, SITE } from '@/lib/site-config';
import { X, Trash2, MessageCircle, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import { submitToReplyPortal } from '@/lib/submit-form';

interface EnquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  enquiredAnimals: AnimalProduct[];
  onRemove: (animalId: string) => void;
  onClear: () => void;
}

export default function EnquiryDrawer({
  isOpen,
  onClose,
  enquiredAnimals,
  onRemove,
  onClear,
}: EnquiryDrawerProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [picNumber, setPicNumber] = useState('');
  const [postcode, setPostcode] = useState('');
  const [notes, setNotes] = useState('');
  const [website, setWebsite] = useState(''); // honeypot — stays blank for real users
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const totalPrice = enquiredAnimals.reduce((sum, item) => sum + item.price, 0);
  const cryptoTotal = Math.round(totalPrice * 0.9);
  const holdingDepositTotal = Math.round(totalPrice * 0.2);
  const qualifiesForFreeDelivery = totalPrice >= SHOP.freeShippingThreshold;

  const generateWhatsAppMessage = () => {
    const animalLines = enquiredAnimals
      .map(
        (a, i) =>
          `${i + 1}. ${a.name} (${a.color} ${a.sizeClass} Highland ${a.sex}, $${a.price} AUD)`
      )
      .join('%0A');

    const customerInfo = `%0A%0A*Buyer Details:*%0AName: ${name || 'Prospective Buyer'}%0APhone: ${phone || 'Pending'}%0APIC Number: ${picNumber || 'Assistance needed'}%0APostcode / State: ${postcode || 'Australia'}`;
    const pricingSummary = `%0A%0A*Order Summary:*%0ATotal (AUD): $${totalPrice.toLocaleString()}%0A20% Holding Deposit: $${holdingDepositTotal.toLocaleString()}%0ACrypto Price (10% Off): $${cryptoTotal.toLocaleString()} AUD`;

    return `https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=Hello%20MHC%20PTY%20LTD!%20I%20would%20like%20to%20reserve%20the%20following%20live%20miniature%20Highland%20cattle:%0A${animalLines}${pricingSummary}${customerInfo}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const animalLines = enquiredAnimals
      .map((a) => `${a.name} (${a.color} ${a.sizeClass} Highland ${a.sex}, $${a.price.toLocaleString()} AUD)`)
      .join('; ');

    const result = await submitToReplyPortal({
      formType: 'enquiry',
      name,
      email,
      website,
      fields: [
        { label: 'Animals Enquired', value: animalLines },
        { label: 'Total (AUD)', value: `$${totalPrice.toLocaleString()}` },
        { label: '20% Holding Deposit', value: `$${holdingDepositTotal.toLocaleString()}` },
        { label: 'Name', value: name },
        { label: 'Phone', value: phone },
        { label: 'Email', value: email },
        { label: 'PIC Number', value: picNumber },
        { label: 'Postcode / State', value: postcode },
        { label: 'Notes', value: notes },
      ],
    });

    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(result.message || 'Could not send your enquiry. Please contact us via WhatsApp instead.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-lg bg-[#fbf9f5] h-full shadow-2xl flex flex-col justify-between border-l border-[#e5dec9] animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#e5dec9] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-[#232320]">
                Livestock Enquiry
              </h2>
              <span className="bg-[#b08d57] text-[#232320] font-bold text-xs px-2 py-0.5 rounded-full">
                {enquiredAnimals.length}
              </span>
            </div>
            <p className="text-xs text-[#705d48]">MHC PTY LTD • Roma, QLD 4455</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {submitted ? (
            <div className="p-6 bg-white rounded-2xl border border-emerald-300 text-center space-y-4 my-8">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#232320]">
                Reservation Request Recorded!
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Thank you, <strong>{name || 'valued buyer'}</strong>. Our Roma stud manager will contact you within 2 business hours regarding pre-transport veterinary health clearances, PIC compliance, and deposit arrangements.
              </p>
              <div className="pt-2">
                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Fast-Track Via WhatsApp Desk
                </a>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClear();
                  onClose();
                }}
                className="text-xs text-[#705d48] underline mt-2 block mx-auto"
              >
                Close and return to herd
              </button>
            </div>
          ) : enquiredAnimals.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-gray-500 text-sm">Your enquiry list is currently empty.</p>
              <p className="text-xs text-gray-400">
                Browse our 72 available cattle and click &ldquo;Enquire / Hold&rdquo; to add animals to this list.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 bg-[#1c3028] text-white rounded-xl text-xs font-bold"
              >
                Browse Herd
              </button>
            </div>
          ) : (
            <>
              {/* List of Animals */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Selected Cattle ({enquiredAnimals.length})</span>
                  <button
                    onClick={onClear}
                    className="text-red-600 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" /> Clear all
                  </button>
                </div>

                {enquiredAnimals.map((animal) => (
                  <div
                    key={animal.id}
                    className="p-3 bg-white rounded-xl border border-[#e5dec9] flex items-center gap-3 shadow-2xs"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={animal.image}
                        alt={animal.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#232320] truncate">
                        {animal.name}
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        {animal.color} • {animal.sizeClass} Highland ({animal.sex})
                      </p>
                      <p className="text-xs font-bold text-[#1c3028] font-serif">
                        ${animal.price.toLocaleString()} AUD
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(animal.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50"
                      aria-label="Remove animal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery Promotion Pill */}
              <div className="p-3 rounded-xl bg-[#ebdcb9]/50 border border-[#d6cbba] text-xs flex items-center gap-2 text-[#40382d]">
                <Truck className="w-4 h-4 text-[#b08d57] shrink-0" />
                <span>
                  {qualifiesForFreeDelivery ? (
                    <strong className="text-emerald-800">
                      ✓ Free Door-to-Paddock Delivery Qualified!
                    </strong>
                  ) : (
                    `Add $${(SHOP.freeShippingThreshold - totalPrice).toLocaleString()} AUD more to qualify for Free Paddock Delivery.`
                  )}
                </span>
              </div>

              {/* Pricing Breakdown */}
              <div className="p-4 bg-white rounded-2xl border border-[#e5dec9] space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Herd Subtotal (GST Inc.)</span>
                  <span className="font-semibold text-gray-800">
                    ${totalPrice.toLocaleString()} AUD
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>10% Crypto Discount (BTC/USDT)</span>
                  <span>-${Math.round(totalPrice * 0.1).toLocaleString()} AUD</span>
                </div>
                <div className="pt-2 border-t border-[#f0ebd9] flex justify-between items-baseline">
                  <span className="font-bold text-[#232320] text-sm">Total Price</span>
                  <span className="font-serif font-bold text-xl text-[#1c3028]">
                    ${totalPrice.toLocaleString()} AUD
                  </span>
                </div>
                <div className="flex justify-between text-[#b08d57] font-semibold text-xs pt-1">
                  <span>Required 20% Holding Deposit</span>
                  <span>${holdingDepositTotal.toLocaleString()} AUD</span>
                </div>
              </div>

              {/* Buyer Contact Details Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3 pt-2">
                {/* Honeypot: real visitors never see or fill this in. */}
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
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

                <h4 className="font-bold text-xs uppercase tracking-wider text-[#40382d]">
                  Buyer Property & Contact
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#d6cbba] bg-white text-xs focus:ring-2 focus:ring-[#b08d57] outline-hidden"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile / Phone *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#d6cbba] bg-white text-xs focus:ring-2 focus:ring-[#b08d57] outline-hidden"
                  />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#d6cbba] bg-white text-xs focus:ring-2 focus:ring-[#b08d57] outline-hidden"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Property PIC Number (if held)"
                    value={picNumber}
                    onChange={(e) => setPicNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#d6cbba] bg-white text-xs focus:ring-2 focus:ring-[#b08d57] outline-hidden"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Delivery Postcode / State *"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#d6cbba] bg-white text-xs focus:ring-2 focus:ring-[#b08d57] outline-hidden"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Special property requirements, acreage size, or transport notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#d6cbba] bg-white text-xs focus:ring-2 focus:ring-[#b08d57] outline-hidden"
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#1c3028] hover:bg-[#284439] disabled:opacity-60 disabled:cursor-not-allowed text-[#f4efe6] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{submitting ? 'Sending…' : 'Submit Livestock Reservation Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer: Fast-track WhatsApp button */}
        {!submitted && enquiredAnimals.length > 0 && (
          <div className="p-4 bg-white border-t border-[#e5dec9] space-y-2">
            <a
              href={generateWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Direct WhatsApp Dispatch (Instant Quote)
            </a>
            <p className="text-[10px] text-center text-gray-400">
              MHC PTY LTD holds ABN 23 158 390 973. Livestock protected under ASIC registration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
