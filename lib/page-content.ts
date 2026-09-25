// lib/page-content.ts
//
// Per-page keyword assignment (1 primary + 5 supporting, all sourced from
// the real SEMrush audit in docs/keyword-map.md - no invented volume/
// difficulty claims here, just the keyword strings themselves) and exactly
// 5 FAQs per page, each written to be specific to that page's actual
// purpose (catalog filtering, order flow, contact, breeding stock, etc.)
// rather than a generic restatement of the site-wide FAQ_ITEMS.
//
// Primary keywords are deliberately kept distinct from the primary
// keyword already used on any blog post or product, to avoid two pieces
// of content competing for the exact same head term (e.g. the
// chondro-guide page targets the DNA-testing/compliance angle while the
// "dwarfism-in-cattle" blog post owns the general "dwarf cow" explainer).

export interface PageFaq {
  question: string;
  answer: string;
}

export interface PageSeo {
  primaryKeyword: string;
  supportingKeywords: string[];
  faqs: PageFaq[];
}

export const PAGE_CONTENT: Record<string, PageSeo> = {
  home: {
    primaryKeyword: 'mini highland cows for sale',
    supportingKeywords: [
      'miniature highland cattle for sale',
      'highland cattle for sale',
      'mini highland cow',
      'fluffy cow',
      'highland cattle near me',
    ],
    faqs: [
      {
        question: 'What is Mini Highland Cows (MHC PTY LTD)?',
        answer: 'MHC PTY LTD (ABN 23 158 390 973) is an Australian-registered breeder of miniature and micro Scottish Highland cattle based in Roma, Queensland, offering registered heifers, cows in calf, foundation pairs, and desexed pet steers with nationwide delivery.',
      },
      {
        question: 'Do you ship live cattle Australia-wide from the homepage listings?',
        answer: 'Yes — every animal featured on the homepage ships door-to-paddock to QLD, NSW, VIC, SA, WA and beyond via accredited livestock transport, with NLIS transfer and a pre-movement NVD included.',
      },
      {
        question: "What's the difference between browsing the Shop and the Available Herd pages?",
        answer: 'Shop lets you filter the full catalogue (livestock and equipment together) by size class, colour, and Chondro status. Available Herd is a live-availability list of cattle only, updated as animals are reserved or sold.',
      },
      {
        question: 'Can I reserve an animal directly from the homepage?',
        answer: 'Yes — every featured animal card links straight to its order page, where you can review full specs and submit a reservation with your delivery and payment details.',
      },
      {
        question: 'Is MHC PTY LTD a registered Australian business?',
        answer: 'Yes — MHC PTY LTD is ASIC-registered with ABN 23 158 390 973, verifiable directly on the Australian Business Register, and operates from Roma, Queensland.',
      },
    ],
  },

  shop: {
    primaryKeyword: 'miniature highland cattle for sale',
    supportingKeywords: [
      'highland steer for sale',
      'highland bull for sale',
      'miniature highland calves for sale',
      'mini cattle for sale',
      'micro cow',
    ],
    faqs: [
      {
        question: 'How do I filter the shop by size class or coat colour?',
        answer: 'Use the filter panel above the product grid to narrow by size class (Micro or Miniature), coat colour, sex, or category — filters combine, so you can view only Micro silver heifers, for example.',
      },
      {
        question: 'Are all animals shown in the shop currently available, or are some already reserved?',
        answer: 'The shop only displays currently available stock. Once an animal is reserved via the order page, it is removed from the live listing rather than left showing as sold.',
      },
      {
        question: 'Can I sort the shop by price?',
        answer: 'Yes — the sort control lets you order the catalogue from lowest to highest price or vice versa, alongside the size and colour filters.',
      },
      {
        question: 'Does the shop include equipment and feed, or only live cattle?',
        answer: 'Both — the shop lists live cattle alongside grooming equipment, paddock gear, and feed/nutrition products, filterable by category so you can view livestock and equipment separately if you prefer.',
      },
      {
        question: "What does the 'Chondro status' filter actually mean?",
        answer: "It filters by each animal's DNA-tested Chondrodysplasia result — Non-Carrier (Chondro-free) or Carrier (Chondro+) — so buyers building a breeding program can find compatible pairings quickly.",
      },
    ],
  },

  herd: {
    primaryKeyword: 'highland cattle for sale',
    supportingKeywords: [
      'highland cow for sale',
      'highland steer for sale',
      'miniature highland cows for sale',
      'mini highland calves for sale',
      'highland bull for sale',
    ],
    faqs: [
      {
        question: 'How often is the Available Herd page updated?',
        answer: 'The herd list reflects live availability — animals are added as they become sale-ready and removed as soon as they\'re reserved through the order page, not on a fixed publishing schedule.',
      },
      {
        question: 'What happens when an animal on the herd page is sold?',
        answer: 'It\'s taken off the live listing so buyers never see or attempt to reserve stock that\'s already gone — we don\'t leave "sold" listings up.',
      },
      {
        question: "Can I see an animal's full veterinary specs from the herd list?",
        answer: 'Yes — click through to any animal\'s detail page for its verified order specifications: NLIS tag, hip height, live weight estimate, sire bloodline, and health/vaccination status.',
      },
      {
        question: 'Are foundation pairs listed separately from single animals on this page?',
        answer: 'No — pairs (like a bonded cow-and-calf or a starter breeding pair) appear as a single listing on the herd page, priced and described as the pair rather than split into two entries.',
      },
      {
        question: 'How do I know if an animal is a Steer, Heifer, or Cow in Calf from the listing?',
        answer: 'Each card shows its sex/class directly beneath the name and price, and the full detail page repeats it alongside size class, colour, and registration status.',
      },
    ],
  },

  about: {
    primaryKeyword: 'highland cattle australia',
    supportingKeywords: [
      'miniature cattle australia',
      'highland cows australia',
      'scottish highland cattle',
      'breeding highland cattle',
      'ahcs registered highland cattle',
    ],
    faqs: [
      {
        question: 'Where exactly is the MHC PTY LTD stud located?',
        answer: 'MHC PTY LTD operates from Roma, Queensland 4455, Australia — a closed-gate breeding property, not a public-access farm.',
      },
      {
        question: 'How long has MHC PTY LTD been registered as a business?',
        answer: 'MHC PTY LTD has been ASIC-registered since 16/05/2012, well before the current stud\'s Highland breeding program — see the About page for the full history.',
      },
      {
        question: "What is MHC's ABN and is it publicly verifiable?",
        answer: 'ABN 23 158 390 973, verifiable directly on the Australian Business Register at abr.business.gov.au — we link to it directly rather than asking buyers to take our word for it.',
      },
      {
        question: 'Does MHC sell only Highland cattle, or other breeds too?',
        answer: 'MHC specialises exclusively in registered miniature and micro Scottish Highland cattle — we don\'t cross-list other cattle breeds.',
      },
      {
        question: 'Why does MHC operate a closed-gate stud rather than an open farm?',
        answer: 'To protect the herd from infectious disease introduced through uncontrolled visitor and vehicle traffic — see our dedicated blog post on the biosecurity policy for the full explanation and what we offer instead of on-farm visits.',
      },
    ],
  },

  contact: {
    primaryKeyword: 'highland cattle near me',
    supportingKeywords: [
      'highland cows near me',
      'highland cows brisbane',
      'highland cows sydney',
      'mini cows australia',
      'highland cows adelaide',
    ],
    faqs: [
      {
        question: "What's the fastest way to reach MHC — phone, email, or WhatsApp?",
        answer: 'WhatsApp typically gets the fastest response during business hours (Mon–Sat, 8am–6pm AEST), since our desk can reply between paddock duties without needing to be at a desk phone.',
      },
      {
        question: "What are MHC's typical response times to enquiries?",
        answer: 'Most enquiries submitted through the contact form or WhatsApp during operating hours receive a reply the same business day; after-hours messages are answered the next business morning.',
      },
      {
        question: 'Can I call before placing an order to ask questions about a specific animal?',
        answer: 'Yes — reference the animal\'s name and ID from its listing page when you call or message, so our desk can pull up its exact specs and current availability immediately.',
      },
      {
        question: 'Does MHC have a physical showroom I can call ahead to visit?',
        answer: 'No — we operate a closed-gate biosecurity stud with no public visits, by design (see our biosecurity policy explained on the blog). Photos, video, and a video call are how we show animals instead.',
      },
      {
        question: 'Who do I contact about an existing order status update?',
        answer: 'Use the same channel you ordered through, quoting your order reference — our desk can check settlement and dispatch status directly without needing you to resubmit any details.',
      },
    ],
  },

  'order-now': {
    primaryKeyword: 'miniature highland cow for sale',
    supportingKeywords: [
      'highland cattle calf for sale',
      'highland bull for sale',
      'highland cow for sale',
      'mini highland cattle for sale',
      'mini highland calves for sale',
    ],
    faqs: [
      {
        question: 'What information do I need ready before starting an order?',
        answer: 'Your delivery address, an active Property Identification Code (PIC) or willingness to register one, and your preferred payment method (bank transfer, crypto, or holding deposit) — having these ready speeds up dispatch once payment clears.',
      },
      {
        question: 'Can I change payment method after starting an order?',
        answer: 'Yes — contact our desk before payment is finalised and we can update the invoice to reflect a different method; once an invoice is issued for one method, switching may require a fresh invoice.',
      },
      {
        question: 'What happens immediately after I submit an order on this page?',
        answer: 'You receive an instant order confirmation email, and our sales desk is notified to prepare and send an official invoice with payment instructions for your chosen method.',
      },
      {
        question: 'Is a deposit required, or full payment upfront?',
        answer: 'Both options exist — a 20% holding deposit secures the animal with the balance due before dispatch, or you can pay the full amount upfront via bank transfer or crypto (crypto carries a discount).',
      },
      {
        question: 'Can I request paddock delivery instructions during the order process?',
        answer: 'Yes — the order form includes a field for gate access and truck-unloading notes, so the livestock carrier has everything they need before arrival day.',
      },
    ],
  },

  'breeding-foundation': {
    primaryKeyword: 'cow breeding',
    supportingKeywords: [
      'breeding highland cattle',
      'mini cow breeding',
      'miniature calf',
      'cattle and calves',
      'ahcs registered highland cattle',
    ],
    faqs: [
      {
        question: "What's included when I buy a 'foundation pair' vs a single heifer?",
        answer: 'A foundation pair is two unrelated, registered animals sold together — typically a female and a compatible mate — already matched for genetics and Chondro status, versus a single heifer sold on her own for you to pair separately.',
      },
      {
        question: 'Are breeding foundation animals guaranteed fertile?',
        answer: 'Cows in calf are sold with a confirmed pregnancy; open heifers and pairs are sold on verified genetics and health, not a fertility guarantee, since fertility can\'t be confirmed until breeding is attempted.',
      },
      {
        question: "Can I request a specific pairing (e.g. Chondro-negative bull with a carrier heifer)?",
        answer: 'Yes — contact our desk with your intended pairing before ordering, and we can confirm both animals\' DNA-tested Chondro status to make sure the pairing follows the never-pair-two-carriers rule.',
      },
      {
        question: 'Do foundation pairs come pre-bonded, or do they need time to settle together?',
        answer: 'Pairs listed together are already bonded at the stud before sale and travel together, so they arrive at your property already settled with each other rather than needing an introduction period.',
      },
      {
        question: 'What documentation comes with a cow already in calf?',
        answer: 'Full AHCS/IMCBR registration papers, DNA Chondro results, vaccination record, and — where available — expected calving date, alongside the standard NLIS transfer and NVD at dispatch.',
      },
    ],
  },

  'chondro-guide': {
    primaryKeyword: 'chondrodysplasia dna test',
    supportingKeywords: [
      'chondro negative highland cattle',
      'dwarf highland cow',
      'mini highland genetics',
      'chondrodysplasia',
      'dehorning cattle',
    ],
    faqs: [
      {
        question: 'How does MHC test for Chondrodysplasia specifically — which lab or method?',
        answer: 'Every breeding animal is DNA tested via an accredited veterinary genetics laboratory panel for the Chondrodysplasia gene, not assessed visually — leg length alone is not a reliable indicator of carrier status.',
      },
      {
        question: 'Will you show me the actual DNA certificate before I buy?',
        answer: 'Yes — DNA test results are available on request for any animal before you commit to a purchase, not just disclosed verbally after the fact.',
      },
      {
        question: "What happens if I want to breed two MHC animals and I'm not sure of their combined Chondro risk?",
        answer: 'Contact our desk with both animals\' IDs and we\'ll confirm their documented Chondro status directly — never assume compatibility from appearance, since two carriers bred together risks lethal bulldog calf syndrome.',
      },
      {
        question: 'Does Chondro status affect which animals qualify for AHCS or IMCBR registration?',
        answer: 'No — registration is based on verified pedigree and conformation, not Chondro status. Both carrier and non-carrier animals can be fully registered; Chondro status is a separate, equally important genetic disclosure.',
      },
      {
        question: 'Is Chondro testing repeated for every calf, or only the breeding parents?',
        answer: 'We test breeding-program parents directly and can predict calf probability from confirmed parent genetics, though individual calf testing is available on request for buyers who want it confirmed independently.',
      },
    ],
  },

  'paddock-companions': {
    primaryKeyword: 'highland steer for sale',
    supportingKeywords: [
      'pet quality highland cow',
      'halter trained mini highland calves',
      'desexed highland steer',
      'do mini cows make good pets',
      'baby highland cow',
    ],
    faqs: [
      {
        question: 'Are paddock companion steers always desexed before sale?',
        answer: 'Yes — every steer listed as a paddock companion is already desexed, which is exactly what keeps their temperament calm and consistent year-round rather than something arranged after purchase.',
      },
      {
        question: 'Can a paddock companion steer be kept with sheep or alpacas instead of cattle?',
        answer: 'Yes — cattle just need herd companionship of some kind, and a steer will happily bond with sheep, alpacas, horses, or donkeys if another Highland isn\'t part of your plan.',
      },
      {
        question: 'Do paddock companions come already halter trained, or do I need to train them myself?',
        answer: 'Our pet steers begin halter introduction from a few weeks old, so most arrive with a solid leading foundation already — though ongoing handling at home keeps that training consistent.',
      },
      {
        question: "What's the age range for animals listed as paddock companions?",
        answer: 'From weaned bottle-baby calves through to fully mature desexed steers — the listing page shows each individual animal\'s current age so you can choose the stage that suits your experience level.',
      },
      {
        question: 'Are paddock companions cheaper than breeding stock?',
        answer: 'Generally yes — a desexed pet steer doesn\'t carry the breeding-genetics premium that a registered heifer or proven cow in calf does, since you\'re buying companionship rather than future breeding value.',
      },
    ],
  },
};
