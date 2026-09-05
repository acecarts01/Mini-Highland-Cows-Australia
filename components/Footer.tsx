'use client';

import React from 'react';
import Link from 'next/link';
import { SITE, CONTACT } from '@/lib/site-config';
import { ShieldCheck, MapPin, Phone, Mail, MessageCircle, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1c3028] text-[#f4efe6] border-t-4 border-[#b08d57] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Corporate Entity & Trust */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#b08d57] text-[#232320] flex items-center justify-center font-bold">
                MHC
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">MHC PTY LTD</h3>
                <p className="text-[11px] text-[#e5c07b]">Australian Proprietary Company</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Ethical breeders of 100% genuine miniature and micro Scottish Highland cattle. We strictly specialize in small-stature cattle (&lt;42&quot;) for lifestyle acreage and gentle companionship—never standard or big cattle.
            </p>

            <div className="p-3.5 bg-[#243e34] rounded-xl border border-[#375a4d] text-[11px] space-y-2 text-gray-200">
              <div className="flex items-center justify-between text-[#e5c07b] font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#e5c07b]" />
                  <span>ASIC Registered Company</span>
                </span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                  ACTIVE
                </span>
              </div>
              <p><strong>ABN:</strong> {SITE.abn}</p>
              <p><strong>ACN:</strong> {SITE.acn}</p>
              <p><strong>Registered Locality:</strong> {SITE.locality}</p>
              <a
                href={SITE.abnLookupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#b08d57] hover:bg-[#c9a367] text-[#232320] font-bold text-xs transition-colors shadow-xs"
                title="Verify MHC PTY LTD directly on the official Australian Business Register"
              >
                <span>Verify ABN on abr.business.gov.au</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links to Individual Pages */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#e5c07b] tracking-wide">
              Herd Pages & Menus
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/order-now" className="text-[#e5c07b] font-bold hover:underline flex items-center gap-1">
                  <span>→</span> Order Now (Direct Paddock Shipping)
                </Link>
              </li>
              <li>
                <Link href="/herd" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>→</span> Available Herd (All 72 Mini Cattle)
                </Link>
              </li>
              <li>
                <Link href="/breeding-foundation" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>→</span> Breeding Foundation (Heifers & Pairs)
                </Link>
              </li>
              <li>
                <Link href="/paddock-companions" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>→</span> Paddock Pets (Steers & Bottle Calves)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>→</span> About Stud & PIC Biosecurity
                </Link>
              </li>
              <li>
                <Link href="/chondro-guide" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>→</span> Chondrodysplasia Genetics Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>→</span> Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>→</span> Contact & Livestock Reservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Biosecurity & Compliance */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#e5c07b] tracking-wide">
              Biosecurity & Transfer
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Every live miniature cow leaves our Roma stud with:
            </p>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li className="flex items-center gap-1.5">
                <span className="text-[#e5c07b]">✓</span> NLIS RFID Ear Tag & NLIS Transfer
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#e5c07b]">✓</span> National Vendor Declaration (NVD)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#e5c07b]">✓</span> 7-in-1 Vaccine & Pestivirus Free Tested
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#e5c07b]">✓</span> Assistance with PIC Registration
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#e5c07b]">✓</span> Humane Paddock-to-Paddock Transport
              </li>
            </ul>
          </div>

          {/* Col 4: Roma Stud Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#e5c07b] tracking-wide">
              Roma Stud & Sales Desk
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e5c07b] shrink-0" />
                <span>Roma QLD 4455, Australia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e5c07b] shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:underline">
                  {CONTACT.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e5c07b] shrink-0" />
                <a href={`tel:${CONTACT.phone}`} className="hover:underline">
                  {CONTACT.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  WhatsApp Live Desk: {CONTACT.whatsapp}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-2.5 rounded-lg bg-[#243e34] border border-[#375a4d] text-[11px] text-gray-300">
                <span className="text-[#e5c07b] font-bold">10% Crypto Discount</span> applied automatically at reservation for Bitcoin (BTC) or Tether (USDT).
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2d4d40] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} <strong>MHC PTY LTD</strong> (ABN: {SITE.abn} | ACN: {SITE.acn}). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white">About Stud</Link>
            <Link href="/faq" className="hover:text-white">PIC Requirements</Link>
            <Link href="/contact" className="hover:text-white">Livestock Warranty</Link>
            <Link href="/herd" className="hover:text-white">Available Mini Herd</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
