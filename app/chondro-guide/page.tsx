'use client';

import React from 'react';
import Link from 'next/link';
import { Ruler, ShieldCheck, AlertTriangle, CheckCircle2, Award, Info, Heart } from 'lucide-react';

export default function ChondroGuidePage() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#b08d57]">Home</Link>
        <span>/</span>
        <span className="text-[#232320] font-semibold">Chondro Genetics Protocol</span>
      </div>

      {/* Header */}
      <div className="border-b border-[#e5dec9] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          Radical Genetic Transparency
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320]">
          Chondrodysplasia Genetics in Mini Highland Cattle
        </h1>
        <p className="text-base text-[#605545] max-w-3xl leading-relaxed">
          Understanding the genetics of small stature is essential for any buyer or breeder. At MHC PTY LTD, we test 100% of our cattle for Chondrodysplasia (the dwarfism gene) and publish clear results on every animal&apos;s record.
        </p>
      </div>

      {/* Comparison Cards: Non-Carrier vs Chondro+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Tested Non-Carrier */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500/50 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
              ✓ Tested Non-Carrier (Negative)
            </span>
            <span className="text-xs text-gray-500 font-medium">True Natural Proportions</span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#232320]">
            Naturally Small Miniature Genetics
          </h2>

          <p className="text-xs text-gray-700 leading-relaxed">
            Non-carrier cattle do NOT possess the chondrodysplasia gene. Their miniature height (34&quot; to 42&quot;) has been achieved entirely through selective breeding over successive generations—mating small, sound bulls to small, sound cows.
          </p>

          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Safe to Breed with Any Bull or Cow
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Standard Leg-to-Body Skeletal Proportions
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Zero Risk of Bulldog Calves in Any Pairing
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed">
            <strong>Ideal For:</strong> Commercial and stud breeders planning to produce calves without requiring genetic pairing restrictions.
          </div>
        </div>

        {/* Card 2: Chondro+ Carrier */}
        <div className="bg-white rounded-3xl border-2 border-amber-500/50 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
              ⚡ Chondro+ (Heterozygous Carrier)
            </span>
            <span className="text-xs text-gray-500 font-medium">Ultra-Compact Legs</span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#232320]">
            The Chondrodysplasia Gene (Dwarfism)
          </h2>

          <p className="text-xs text-gray-700 leading-relaxed">
            Chondro+ cattle carry one copy of the BD1 or BD2 gene. This produces exceptionally short legs, a wide head, and a deep body, often standing between 32&quot; and 36&quot; at maturity. They live normal, healthy, happy lives as companions or controlled breeders.
          </p>

          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-center gap-2 text-amber-800 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              NEVER Breed Chondro+ to Another Chondro+ (25% Lethal Risk)
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Safe when bred to a Tested Non-Carrier
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Outstanding Paddock Pets & Lawn Mowers
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <strong>Breeding Rule:</strong> If you purchase a Chondro+ heifer or cow, you must ONLY mate her to a certified Non-Carrier bull. We provide full DNA certificates at handover.
          </div>
        </div>
      </div>

      {/* Breeding Punnett Square & Explanation */}
      <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#232320]">
          The Golden Rule of Miniature Cattle Breeding
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#e8e2d2] space-y-2">
            <div className="font-bold text-[#1c3028]">Non-Carrier × Non-Carrier</div>
            <p className="text-gray-600">
              100% Non-Carrier calves. Completely safe. Produces proportionate natural miniature cattle.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#e8e2d2] space-y-2">
            <div className="font-bold text-[#1c3028]">Chondro+ × Non-Carrier</div>
            <p className="text-gray-600">
              50% Chondro+ calves, 50% Non-Carrier calves. Completely safe! Zero risk of lethal defects.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
            <div className="font-bold text-red-800">Chondro+ × Chondro+ (STRICTLY FORBIDDEN)</div>
            <p className="text-red-700">
              25% lethal bulldog calf (aborts or dies at birth). MHC PTY LTD strictly prohibits this pairing.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#f0ebd9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            Have questions about genetic pairing or want to inspect testing certificates for our herd?
          </p>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-[#b08d57] text-[#232320] font-bold text-xs hover:bg-[#c4a065] transition-colors"
          >
            Ask Our Stud Geneticist →
          </Link>
        </div>
      </div>
    </div>
  );
}
