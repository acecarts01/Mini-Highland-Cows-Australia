'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqAccordionProps {
  items: { question: string; answer: string }[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#e5dec9] overflow-hidden transition-all shadow-xs"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-[#232320] hover:text-[#b08d57] transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${idx}`}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#b08d57] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/*
              Rendered always, hidden when collapsed, so the answer text is in the
              server HTML for crawlers rather than appearing only after a click.
            */}
            <div
              id={`faq-answer-${idx}`}
              hidden={!isOpen}
              className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-[#f0ebd9] mt-1 bg-[#fcfbf9]"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
