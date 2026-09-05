import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, SITE } from '@/lib/site-config';
import { ChevronRight, Calendar, Clock, ArrowLeft, ShieldCheck, Truck, BookOpen, MessageCircle } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Rich post article content mapping
  const articleContent: Record<string, { subtitle: string; sections: { title: string; body: string }[] }> = {
    'how-much-do-mini-highland-cows-cost-australia': {
      subtitle: 'A realistic investment breakdown for desexed pets, breeding heifers, and micro foundation pairs in Australia.',
      sections: [
        {
          title: '1. Pet Quality Steers: $3,800 – $6,500 AUD',
          body: 'Desexed steers make the ultimate lifestyle companions for acreage owners. They do not experience hormonal cycles, remain exceptionally gentle, and are naturally docile pasture mowers. Prices vary based on coat color (silver, dun, and white command a premium) and temperament training (halter and lead trained).',
        },
        {
          title: '2. Registered Miniature Heifers: $7,500 – $12,500 AUD',
          body: 'Young females (6 to 18 months) registered with AHCS or IMCBR with documented parentage and DNA Chondrodysplasia clearance. Heifers from established studs with low hip height genetics and champion bloodlines represent the core of Australian breeding foundations.',
        },
        {
          title: '3. Micro Scottish Highlands (<36 Inches): $11,000 – $16,000+ AUD',
          body: 'True micro-height cattle are exceedingly rare in Australia. Animals genetically verified to mature at or under 36 inches at the hip require multi-generational responsible breeding. Micro heifers in rare silver, snow-white, or dun coats command premium valuation across the livestock industry.',
        },
        {
          title: '4. Ongoing Ownership & Paddock Setup Costs',
          body: 'Budgeting for miniature cattle extends beyond purchase price. Essential upfront infrastructure includes standard 4-to-5 strand cattle fencing, a shaded shelter, fresh water troughs, and pasture drenching gear. Annual veterinary costs, 7-in-1 vaccinations, and mineral supplementation typically average $350–$600 AUD per head annually.',
        },
      ],
    },
    'micro-vs-mini-highland-explained': {
      subtitle: 'Understanding hip height benchmarks, adult weight projections, and responsible genetic selection.',
      sections: [
        {
          title: 'Hip Height: The Definitive Australian Standard',
          body: 'In Australia, standard commercial Scottish Highland cattle stand 48 to 56 inches at the hip and weigh between 500kg to 900kg. By contrast, Miniature Highland cattle stand strictly between 36 and 42 inches at 3 years of maturity. Micro Highland cattle measure 36 inches or less.',
        },
        {
          title: 'Chondrodysplasia (Dwarfism) Genetics',
          body: 'Chondrodysplasia is a naturally occurring gene mutation that reduces long-bone growth. A carrier animal (Chondro+) has shorter legs while retaining a normal body barrel. While Chondro+ animals make healthy companions, two carriers must NEVER be mated together (which produces a lethal bulldog calf). At MHC PTY LTD, every single animal is DNA-tested with results publicly stamped.',
        },
        {
          title: 'Pasture & Acreage Requirements',
          body: 'While standard cattle require 2–5 acres per head depending on pasture rainfall, a pair of miniature Highland cattle can happily thrive on 1 to 2 acres of quality grass with supplemental hay during dry winter periods. Cattle are herd animals and should always be kept in pairs or with a companion.',
        },
      ],
    },
    'pic-and-nlis-explained-australia': {
      subtitle: 'The essential legal compliance steps for hobby farmers buying miniature cattle in Australia.',
      sections: [
        {
          title: 'What is a Property Identification Code (PIC)?',
          body: 'In Australia, every property keeping designated livestock—including a single pet miniature cow—is legally required to have a Property Identification Code (PIC). A PIC is an 8-character alphanumeric code allocated by your state agricultural department (e.g., Biosecurity Queensland, NSW Local Land Services, Agriculture Victoria). Obtaining a PIC takes just a few minutes online and costs approximately $20–$90 depending on state.',
        },
        {
          title: 'The National Livestock Identification System (NLIS)',
          body: 'The NLIS is Australia\'s system for livestock identification and traceability. Every calf born at MHC PTY LTD is tagged in the right ear with an electronic RFID button tag. When we ship an animal to your property, our stud team submits the electronic transfer on the national NLIS database, transferring legal custody to your property PIC.',
        },
        {
          title: 'Closed-Gate Stud Biosecurity',
          body: 'To protect our herd from contagious livestock diseases (such as Bovine Viral Diarrhea / Pestivirus, Tick Fever, and Leptospirosis), our Roma Queensland property operates under a strict closed-gate biosecurity protocol. We do not permit public drive-in tours; every animal is dispatched directly via accredited livestock carriers with full health certificates.',
        },
      ],
    },
    'why-miniature-highland-steers-make-the-best-paddock-companions': {
      subtitle: 'Why desexed miniature steers are the gentlest, most affordable, and rewarding choice for lifestyle properties.',
      sections: [
        {
          title: '1. The Docile, Affectionate Nature of Steers',
          body: 'Desexed steers do not experience seasonal hormonal fluctuations, making them exceptionally steady, affectionate, and calm paddock pets. They love chin scratches, approach the fence when called, and form deep bonds with families, hobby farmers, and children.',
        },
        {
          title: '2. Halter-Breaking & Daily Interaction',
          body: 'At MHC PTY LTD, our pet steers are introduced to halter training, leading, and tie-up protocols early in life. With simple positive reinforcement using high-fiber lucerne chaff and molasses treats, our steers walk politely on lead and enjoy regular brushing sessions.',
        },
        {
          title: '3. Herd Companionship: Always Keep a Pair',
          body: 'Cattle are deeply social herd animals. A solitary cow experiences chronic stress, pacing fences and vocalizing. We strongly recommend keeping at least two steers together or pairing a steer with an existing equine or alpacal herdmate so they can groom and rest in contented company.',
        },
        {
          title: '4. Natural Pasture Mowers with Gentle Hoof Pressure',
          body: 'Weighing roughly one-third of commercial beef cattle (200kg to 300kg vs 800kg+), miniature Highland steers exert significantly lower compaction on delicate acreage soils while providing natural weed control and lush pasture maintenance.',
        },
      ],
    },
    'miniature-highland-grooming-blowers-and-coat-care-guide': {
      subtitle: 'A professional breeder guide to keeping the Scottish double-coat clean, mat-free, and healthy in Australian climates.',
      sections: [
        {
          title: '1. Anatomy of the Scottish Double Coat',
          body: 'Highland cattle possess a dual-layer fleece: a long, oily outer guard coat that repels rain, burs, and dust, and a dense, downy undercoat providing thermal regulation against both frosty winters and intense sun.',
        },
        {
          title: '2. Why High-Velocity Livestock Blowers are Essential',
          body: 'Standard hair dryers or dog blowers fail to penetrate Highland fleece. A commercial 4.0HP dual-motor livestock blower blasts pressurized room-temperature air directly to the skin, lifting out embedded dirt, grass seeds, and shed hair without stripping essential natural oils.',
        },
        {
          title: '3. Scotch Combs, Shedding Blades & Horn Conditioning',
          body: 'Regular grooming with wide-tooth Scotch combs trains the fleece to fall in classic Scottish waves. During dry months, applying natural mineral or lanolin oil to developing horns prevents flaking and maintains a rich, lustrous shine.',
        },
        {
          title: '4. Australian Summer & Fly Defense Protocols',
          body: 'In warmer Australian months, cattle appreciate shaded timber groves, cool mud wallows, or dam access. Pairing high-velocity blowers with gentle pyrethrin fly repellents prevents buffalo fly irritation and keeps cattle calm and content.',
        },
      ],
    },
    'starting-a-miniature-highland-fold-foundation-pairs': {
      subtitle: 'Everything prospective breeders need to know about pedigree bloodlines, genetic pairings, and calving on acreage.',
      sections: [
        {
          title: '1. Selecting Unrelated Registered Foundation Stock',
          body: 'Starting a registered fold requires genetically sound foundation stock. Investing in AHCS or IMCBR certified pairs ensures verified generational pedigrees, correct square conformation, and legitimate low-hip-height lineage.',
        },
        {
          title: '2. The Golden Rule of Chondrodysplasia Genetics',
          body: 'When breeding miniature Highlands, never mate two Chondro+ carrier animals together, as this incurs a 25% risk of fatal bulldog syndrome. Responsible breeding pairs always match a carrier with a non-carrier (Chondro-free), guaranteeing 100% healthy, vigorous calves.',
        },
        {
          title: '3. Calving Preparation & Maternity Paddocks',
          body: 'Highland cows are renowned for effortless calving, strong maternal instincts, and rich colostrum. Prepare a secure, predator-free maternity paddock with good shelter, fresh water, and quality clover/rye pasture 4 weeks prior to the anticipated calving date.',
        },
        {
          title: '4. National Livestock Compliance: PIC & NLIS Audits',
          body: 'Maintain meticulous breeding records, ear tag newborn calves within their first weeks, and record NLIS transfers whenever cattle move. This upholds Australian agricultural integrity and maximizes the commercial pedigree value of your progeny.',
        },
      ],
    },
  };

  const article = articleContent[slug] || {
    subtitle: post.excerpt,
    sections: [
      {
        title: 'Livestock Care & Best Practices',
        body: post.excerpt,
      },
    ],
  };

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Breadcrumbs */}
      <div className="bg-[#fbf9f5] border-b border-[#e5dec9] py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#b08d57]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-[#b08d57]">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#232320] font-semibold truncate max-w-xs">{post.title}</span>
          </div>
        </div>
      </div>

      {/* 2. Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#b08d57] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Guides
          </Link>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#b08d57]" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#b08d57]" />
              {post.readTime}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#ebdcb9] text-[#6d4c1b] font-bold">
              MHC Stud Editorial
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#232320] leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-serif italic border-l-4 border-[#b08d57] pl-4">
            {article.subtitle}
          </p>
        </div>

        {/* Featured Image Frame */}
        {post.image && (
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-2xl overflow-hidden border border-[#e5dec9] bg-white shadow-xs">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-contain p-2"
              sizes="(max-width: 1024px) 100vw, 896px"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* 3. Main Body Sections */}
        <div className="prose prose-stone max-w-none space-y-8 text-gray-800 text-sm sm:text-base leading-relaxed">
          {article.sections.map((section, idx) => (
            <section key={idx} className="p-6 bg-white rounded-2xl border border-[#e5dec9] shadow-xs space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#232320]">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* 4. Action Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c3028] text-white border border-[#375a4d] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs text-[#e5c07b] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#e5c07b]" />
              MHC PTY LTD • ABN: 23 158 390 973
            </span>
            <h3 className="font-serif text-xl font-bold">Interested in Current Available Stock?</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Browse our 72 micro and miniature cattle or place a direct paddock delivery order online.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full bg-[#e5c07b] hover:bg-[#d4af37] text-[#232320] font-bold text-xs transition-all shadow-sm"
            >
              Shop All Cattle
            </Link>
            <Link
              href="/order-now"
              className="px-6 py-3 rounded-full bg-white text-[#232320] hover:bg-gray-100 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#b08d57]" />
              Order Now
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
