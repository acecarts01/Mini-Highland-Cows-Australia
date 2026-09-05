'use client';

import React, { useState } from 'react';
import { CONTACT, SITE } from '@/lib/site-config';
import { MessageCircle, Phone, Mail, X, ShieldCheck } from 'lucide-react';

export default function ChatHub() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl border border-[#e5dec9] p-4 w-72 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs text-[#232320]">MHC Live Stud Desk</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-gray-600 leading-relaxed">
            Need video walkarounds, pedigree papers, or transport quotes for your property? Chat directly with our Roma paddock manager.
          </p>

          <div className="space-y-2 pt-1">
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Live Desk
            </a>

            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-2 w-full p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#b08d57]" />
              Call: {CONTACT.phone}
            </a>

            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-2 w-full p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#b08d57]" />
              Email Sales Desk
            </a>
          </div>

          <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>MHC PTY LTD • ABN: {SITE.abn}</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 border-2 border-white"
        aria-label="Open live chat desk"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#b08d57] border-2 border-white flex items-center justify-center text-[9px] font-bold text-black">
          1
        </span>
      </button>
    </div>
  );
}
