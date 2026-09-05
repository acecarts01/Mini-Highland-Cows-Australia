'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE, CONTACT, FORMS } from '@/lib/site-config';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Truck,
} from 'lucide-react';

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pic: '',
    cattleInterest: '',
    paymentPreference: 'Crypto (BTC / USDT - 10% Off)',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const form = e.currentTarget;
    const accessKey = FORMS.web3formsKey;

    // Key-pending fallback
    if (!accessKey || accessKey.startsWith('YOUR-') || accessKey === 'PENDING') {
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 600);
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not send enquiry. Please contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#b08d57]">Home</Link>
        <span>/</span>
        <span className="text-[#232320] font-semibold">Contact & Livestock Reservations</span>
      </div>

      {/* Header */}
      <div className="border-b border-[#e5dec9] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] text-xs font-bold uppercase tracking-wider">
          <MessageCircle className="w-3.5 h-3.5" />
          Roma QLD Direct Livestock Sales & Shipping Desk
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320]">
          Order Now & Livestock Inquiries
        </h1>
        <p className="text-base text-[#605545] max-w-3xl leading-relaxed">
          Order live miniature Highland cattle online with direct door-to-paddock shipping to your nominated Australian address. For strict biosecurity protection of calves and breeding stock, we operate a closed herd with zero on-farm public inspections.
        </p>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-[#1c3028] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#375a4d]">
        <div className="space-y-1">
          <p className="font-bold text-[#e5c07b] text-sm flex items-center gap-2">
            <Truck className="w-4 h-4" /> Ready to Place an Order for Immediate Paddock Delivery?
          </p>
          <p className="text-xs text-gray-300">
            View full technical specifications, ear tags, live weights, and freight quotes on our dedicated Order Portal.
          </p>
        </div>
        <Link
          href="/order-now"
          className="px-5 py-2.5 rounded-xl bg-[#b08d57] text-[#232320] font-bold text-xs hover:bg-[#c4a065] transition-colors shrink-0"
        >
          Go to Order Now Menu →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Information & Corporate Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#232320]">
              Stud Office & Biosecurity Headquarters
            </h2>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#b08d57] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-[#232320]">Breeding Pastures (Closed-Gate)</strong>
                  <span>Roma QLD 4455, Australia. (Strict biosecurity: 100% direct paddock shipping to desired address; no on-farm public inspections)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#b08d57] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-[#232320]">Telephone Direct</strong>
                  <a href={`tel:${CONTACT.phone}`} className="hover:underline">{CONTACT.phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#b08d57] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-[#232320]">Official Email</strong>
                  <a href={`mailto:${CONTACT.email}`} className="hover:underline">{CONTACT.email}</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#b08d57] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-[#232320]">Operating Hours</strong>
                  <span>{CONTACT.operatingHours}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Fastest Response: WhatsApp Live Desk
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Connect directly with our Roma stud manager for instant photo videos, height verifications, or holding deposit invoices.
              </p>
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
              >
                Chat on WhatsApp ({CONTACT.whatsapp})
              </a>
            </div>

            {/* ASIC Verification */}
            <div className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#e5dec9] text-[11px] space-y-1 text-gray-700">
              <div className="font-bold text-[#1c3028] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b08d57]" /> Verified Corporate Breeder
              </div>
              <p>MHC PTY LTD (ACN: {SITE.acn})</p>
              <p>ABN: {SITE.abn}</p>
              <p>Locality: {SITE.locality}</p>
            </div>
          </div>
        </div>

        {/* Contact / Reservation Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#232320]">Enquiry Received</h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you for your enquiry. Our Roma sales team will review your property details, verify cattle availability, and reply within 4 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-[#b08d57] text-[#232320] font-bold text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Web3Forms required hidden inputs */}
              <input type="hidden" name="access_key" value={FORMS.web3formsKey} />
              <input type="hidden" name="subject" value="New Live Cattle Reservation Enquiry - MHC PTY LTD" />
              <input type="hidden" name="from_name" value="MHC Website Reservation" />
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-full-name" className="block text-xs font-bold text-[#232320] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="contact-full-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lachlan Macquarie"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8d0bd] bg-[#fcfbf9] text-xs focus:outline-hidden focus:border-[#b08d57]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email-addr" className="block text-xs font-bold text-[#232320] mb-1">
                    Email Address *
                  </label>
                  <input
                    id="contact-email-addr"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. yourname@property.com.au"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8d0bd] bg-[#fcfbf9] text-xs focus:outline-hidden focus:border-[#b08d57]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone-num" className="block text-xs font-bold text-[#232320] mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    id="contact-phone-num"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0412 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8d0bd] bg-[#fcfbf9] text-xs focus:outline-hidden focus:border-[#b08d57]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-pic-code" className="block text-xs font-bold text-[#232320] mb-1">
                    Property PIC (Optional / If Known)
                  </label>
                  <input
                    id="contact-pic-code"
                    type="text"
                    name="pic"
                    value={formData.pic}
                    onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                    placeholder="e.g. QDBB1234 or write 'Need Help'"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8d0bd] bg-[#fcfbf9] text-xs focus:outline-hidden focus:border-[#b08d57]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-cattle-interest" className="block text-xs font-bold text-[#232320] mb-1">
                    Animal of Interest
                  </label>
                  <input
                    id="contact-cattle-interest"
                    type="text"
                    name="cattleInterest"
                    value={formData.cattleInterest}
                    onChange={(e) => setFormData({ ...formData, cattleInterest: e.target.value })}
                    placeholder="e.g. Isla, Hamish, or Bottle Calf Pair"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8d0bd] bg-[#fcfbf9] text-xs focus:outline-hidden focus:border-[#b08d57]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-payment-pref" className="block text-xs font-bold text-[#232320] mb-1">
                    Payment & Settlement
                  </label>
                  <select
                    id="contact-payment-pref"
                    name="paymentPreference"
                    value={formData.paymentPreference}
                    onChange={(e) => setFormData({ ...formData, paymentPreference: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8d0bd] bg-[#fcfbf9] text-xs focus:outline-hidden focus:border-[#b08d57]"
                  >
                    <option value="Crypto (BTC / USDT - 10% Off)">Crypto (Bitcoin/USDT - 10% Discount)</option>
                    <option value="Direct Bank Transfer / PayID">Direct Bank Transfer / PayID</option>
                    <option value="20% Holding Deposit First">20% Holding Deposit First</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message-body" className="block text-xs font-bold text-[#232320] mb-1">
                  Property Details & Questions *
                </label>
                <textarea
                  id="contact-message-body"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your property size (acres), fencing, location for delivery quotes, or questions on miniature sizing..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8d0bd] bg-[#fcfbf9] text-xs focus:outline-hidden focus:border-[#b08d57]"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#b08d57] hover:bg-[#977340] text-[#232320] hover:text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting Reservation...' : 'Submit Livestock Enquiry →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
