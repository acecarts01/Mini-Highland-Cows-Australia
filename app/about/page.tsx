import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';
import { SITE, CONTACT } from '@/lib/site-config';
import { PAGE_CONTENT } from '@/lib/page-content';

const seo = PAGE_CONTENT.about;
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Ruler,
  Award,
  Heart,
  Truck,
  CheckCircle2,
  FileText,
  MessageCircle,
  Phone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Our Roma QLD Highland Stud',
  description:
    'MHC PTY LTD (ABN 23 158 390 973) is an ASIC-registered miniature Highland cattle stud in Roma, Queensland. Learn about our closed-herd biosecurity, Chondro testing policy, and Australian PIC/NLIS compliance.',
  keywords: [seo.primaryKeyword, ...seo.supportingKeywords],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Mini Highland Cows | Roma QLD Miniature Highland Stud',
    description:
      'ASIC-registered miniature and micro Scottish Highland cattle stud in Roma, Queensland. Chondro-tested, halter-trained, PIC/NLIS compliant.',
    url: '/about',
    images: ['/og-default.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About Stud & PIC Compliance', path: '/about' },
          ]),
          faqSchema(seo.faqs, '/about'),
        ]}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#b08d57]">Home</Link>
        <span>/</span>
        <span className="text-[#232320] font-semibold">About Stud & PIC Compliance</span>
      </div>

      {/* Header */}
      <div className="border-b border-[#e5dec9] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcb9] text-[#6d4c1b] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          MHC PTY LTD • ASIC Registered Stud
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320]">
          About Mini Highland Cows & Biosecurity
        </h1>
        <p className="text-base text-[#605545] max-w-3xl leading-relaxed">
          Operating out of Roma, Queensland, MHC PTY LTD is Australia&apos;s dedicated ethical breeder of true miniature and micro Scottish Highland cattle. 
          <strong> We breed, raise, and sell exclusively miniature cattle (mature height under 42 inches)—we never produce or deal in standard or big commercial cows.</strong>
        </p>
      </div>

      {/* Grid of Corporate Authority & Facts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#e5dec9] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#b08d57] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" /> ASIC Corporate Entity
          </div>
          <p className="text-lg font-serif font-bold text-[#1c3028]">MHC PTY LTD</p>
          <div className="text-xs text-gray-600 space-y-0.5">
            <p><strong>ABN:</strong> {SITE.abn}</p>
            <p><strong>ACN:</strong> {SITE.acn}</p>
            <p><strong>Registered:</strong> {SITE.regDate}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e5dec9] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#b08d57] font-bold text-xs">
            <MapPin className="w-4 h-4" /> Roma Station HQ
          </div>
          <p className="text-lg font-serif font-bold text-[#1c3028]">Roma, QLD 4455</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            High-country pastoral grazing, acclimatized to Queensland warmth and southern cold snaps alike.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e5dec9] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#b08d57] font-bold text-xs">
            <Ruler className="w-4 h-4" /> Size Standards
          </div>
          <p className="text-lg font-serif font-bold text-[#1c3028]">32&quot; to 42&quot; Hip Height</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Strictly Micro (&lt;36&quot;) and Miniature (&lt;42&quot;). Certified 0% big/commercial cattle.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e5dec9] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#b08d57] font-bold text-xs">
            <Award className="w-4 h-4" /> Biosecurity & NLIS
          </div>
          <p className="text-lg font-serif font-bold text-[#1c3028]">100% NLIS RFID</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Electronic NLIS ear tagging, National Vendor Declaration, 7-in-1 vaccines, and full PIC transfer.
          </p>
        </div>
      </div>

      {/* Detailed Story & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 space-y-6 text-sm text-[#3b3429] leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">
            Our Foundation: Why Miniature Highland Cattle?
          </h2>

          <p>
            Scottish Highland cattle are celebrated globally for their majestic double coats, hardy constitution, and gentle nature. However, standard commercial Scottish Highland cows mature at 48 to 56 inches at the hip and weigh between 500kg and 800kg. For acreage owners with 1 to 10 acres, handling standard-sized cattle presents fencing challenges, heavy paddock compaction, and intimidation for young families.
          </p>

          <p className="p-4 bg-[#f8f5ee] rounded-2xl border-l-4 border-[#b08d57] text-gray-800 font-medium">
            &quot;At MHC PTY LTD, our mission has been singular from day one: selective breeding for true miniature and micro proportions without sacrificing the iconic Highland double coat, sweeping horn symmetry, or gentle disposition. We do NOT sell standard big cattle.&quot;
          </p>

          <h3 className="font-serif text-xl font-bold text-[#232320] pt-2">
            The Science of True Miniature Size vs. Chondrodysplasia
          </h3>

          <p>
            Achieving small stature in cattle occurs through two primary biological avenues:
          </p>
          <ul className="space-y-3 pl-4 border-l-2 border-[#e5dec9]">
            <li>
              <strong>1. Natural Proportional Miniatures (Non-Carrier / Chondro-Negative):</strong> These cattle inherit naturally small genetics through generations of mating the smallest, most proportionate parents. They have standard body proportions, normal legs, and clean DNA test results.
            </li>
            <li>
              <strong>2. Chondro+ Miniatures (Carrier of BD1/BD2 Dwarfism Gene):</strong> These cattle carry one copy of the chondrodysplasia gene, resulting in shorter cannon bones and compact legs. While completely healthy as companions, breeding two Chondro+ animals together produces lethal bulldog calves.
            </li>
          </ul>

          <p>
            At MHC PTY LTD, we test 100% of our cattle via DNA hair root samples and publish the exact chondro status on every single animal card. We never obscure or conceal genetic statuses.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#232320] pt-2">
            What is a PIC and Why Do You Need One?
          </h3>

          <p>
            Under Australian state and federal biosecurity legislation (managed by state departments of agriculture including Biosecurity Queensland, NSW DPI, and Agriculture Victoria), <strong>anyone keeping live cattle, even a single miniature pet steer on 1 acre, must register a Property Identification Code (PIC)</strong>.
          </p>

          <div className="p-4 bg-[#f4efe6] rounded-2xl border border-[#e5dec9] space-y-2 text-xs">
            <h4 className="font-bold text-[#232320] text-sm">How to Get a PIC in 3 Easy Steps:</h4>
            <ol className="list-decimal pl-4 space-y-1 text-gray-700">
              <li>Visit your state Department of Primary Industries or Agriculture website (e.g. Biosecurity QLD, Local Land Services NSW).</li>
              <li>Complete the online application with your property&apos;s lot and plan number or address (fees range from $0 to ~$80 depending on the state).</li>
              <li>Provide your 8-character PIC code to MHC PTY LTD so we can lodge your official electronic NLIS RFID cattle transfer.</li>
            </ol>
          </div>

          <p>
            If you do not yet have a PIC, our Roma sales desk assists lifestyle acreage buyers every single week with their registration.
          </p>
        </div>

        {/* Sidebar: Direct Shipping & Biosecurity Protocol */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1c3028] text-white rounded-3xl p-6 sm:p-8 border border-[#375a4d] space-y-6 shadow-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ebdcb9]/20 text-[#e5c07b] text-[11px] font-bold uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              Strict Biosecurity Rating
            </div>
            <h3 className="font-serif text-xl font-bold text-[#e5c07b]">
              No Farm Inspections — 100% Direct Shipping
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              To uphold stringent closed-herd biosecurity standards (preventing introduction of Pestivirus/BVDV, Theileria, Johnes disease, and hoof rot), <strong>we do not conduct public or private farm inspections.</strong>
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Instead, <strong>we sell exclusively by shipping the animal directly to your desired property address or paddock gate</strong> via accredited, climate-controlled livestock freight. All cattle travel with official NLIS tags, NVD declarations, and pre-departure veterinary clearances.
            </p>

            <div className="space-y-3 text-xs text-gray-300 border-t border-[#2d4d40] pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e5c07b]" />
                <span>Pastures in Roma QLD 4455 (Strictly Closed-Gate)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e5c07b]" />
                <span>{CONTACT.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  WhatsApp: {CONTACT.whatsapp}
                </a>
              </div>
            </div>

            <Link
              href="/order-now"
              className="block text-center w-full py-3 px-4 rounded-xl bg-[#b08d57] text-[#232320] font-bold text-xs hover:bg-[#c4a065] transition-colors shadow-xs"
            >
              Order for Direct Paddock Delivery →
            </Link>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-[#e5dec9] space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-[#232320] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#b08d57]" /> Direct Door-to-Paddock Freight
            </h4>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              We coordinate professional, humane delivery directly to your nominated farm or acreage address across QLD, NSW, VIC, SA, WA, and TAS. Orders qualify for delivery freight subsidies.
            </p>
            <Link href="/order-now" className="text-[#b08d57] font-semibold hover:underline block pt-1">
              Order Online with Desired Address →
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#232320]">About MHC — FAQs</h2>
        <FaqAccordion items={seo.faqs} />
      </div>
    </div>
  );
}
