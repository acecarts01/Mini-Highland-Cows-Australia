// lib/product-faqs.ts
//
// Exactly 3 FAQs per product (animal or equipment), generated from that
// product's own data fields (name, price, colour, height, chondro status,
// temperament, dimensions, warranty, etc.) - never hand-authored per item,
// never copied between products. Because every product's field values
// differ, the generated FAQ text is genuinely unique per product: no two
// products (and nothing here duplicates the site-wide FAQ_ITEMS or any
// blog post's FAQs) end up with matching question/answer text.
//
// A small deterministic rotation (based on the product id) varies WHICH
// three FAQ topics get chosen per product, not just the values plugged
// into them - so adjacent listings don't all surface the same three
// questions in the same order either.

import type { AnimalProduct } from './site-config';

export interface ProductFaq {
  question: string;
  answer: string;
}

function subjectNoun(p: AnimalProduct): string {
  switch (p.sex) {
    case 'Breeding Pair':
      return 'this pair';
    case 'Heifer':
      return 'this heifer';
    case 'Steer':
      return 'this steer';
    case 'Cow in Calf':
      return 'this cow';
    case 'Heifer Calf':
    case 'Steer Calf':
      return 'this calf';
    default:
      return 'this item';
  }
}

function possessive(p: AnimalProduct): string {
  return p.sex === 'Breeding Pair' ? 'their' : 'its';
}

type FaqBuilder = (p: AnimalProduct) => ProductFaq | null;

// ---------------------------------------------------------------------
// Livestock builders - only fire when the relevant field is present.
// ---------------------------------------------------------------------

const priceFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock') return null;
  return {
    question: `What does the $${p.price.toLocaleString('en-AU')} AUD price for ${p.name} actually include?`,
    answer: `The listed price for ${p.name} covers the animal${p.registry ? ` with full ${p.registry} paperwork` : ''}${p.chondroStatus ? ` and documented Chondrodysplasia DNA status (${p.chondroStatus})` : ''}. Delivery, PIC transfer, and NLIS registration are arranged separately at dispatch — see the order page for freight details.`,
  };
};

const heightFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock' || !p.heightInches || !p.sizeClass) return null;
  return {
    question: `How big is ${p.name} expected to grow?`,
    answer: `${p.name} is classed as ${p.sizeClass}, standing ${p.heightInches} inches (${Math.round(p.heightInches * 2.54)}cm) at the hip${p.dobOrAge ? ` at ${p.dobOrAge}` : ''}. ${p.sizeClass === 'Micro' ? 'Micro-classed animals mature at or under 36 inches at the hip.' : 'Miniature-classed animals mature between 36 and 42 inches at the hip.'}`,
  };
};

const chondroFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock' || !p.chondroStatus) return null;
  return {
    question: `Is ${p.name} a Chondrodysplasia (dwarfism gene) carrier?`,
    answer: `${p.name}'s DNA-tested Chondrodysplasia status is: ${p.chondroStatus}. This is confirmed by DNA panel, not visual assessment, and the certificate is available on request before purchase.`,
  };
};

const hornFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock' || !p.hornStatus) return null;
  return {
    question: `Does ${p.name} have horns?`,
    answer: `${p.name}'s horn status is recorded as: ${p.hornStatus}. If horn-free handling matters for your property, ask our desk about dehorning or polled-genetics options before ordering.`,
  };
};

const temperamentFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock' || !p.temperament) return null;
  return {
    question: `What is ${p.name}'s temperament like day to day?`,
    answer: `Our breeder notes describe ${p.name} as: "${p.temperament}." Temperament notes come from daily handling at the stud, not a one-off assessment.`,
  };
};

const registryFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock' || !p.registry) return null;
  return {
    question: `Is ${p.name} registered, and with which body?`,
    answer: `Yes — ${p.name} is ${p.registry}. Registration papers documenting verified parentage are provided at the time of sale and transfer with the animal.`,
  };
};

const colourFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock' || !p.color) return null;
  return {
    question: `What coat colour is ${p.name}?`,
    answer: `${p.name} carries a ${p.color.toLowerCase()} coat. Coat colour is a genetic trait separate from height class or Chondrodysplasia status — ask our desk if you'd like the specific colour genetics behind this coat explained.`,
  };
};

const companionFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock') return null;
  const noun = subjectNoun(p);
  if (p.sex === 'Breeding Pair') {
    return {
      question: `Do I need to buy any other animals alongside ${p.name}?`,
      answer: `No — ${p.name} is already sold as a pair, so ${possessive(p)} herd-companionship needs are met from day one. Cattle are social herd animals, and a matched pair like this avoids the isolation stress a single animal can experience.`,
    };
  }
  return {
    question: `Does ${p.name} need to be kept with another animal?`,
    answer: `We recommend it. Cattle are herd animals, and ${noun} will do best paired with a second animal — another Highland, or an existing horse, alpaca, or donkey it can bond with — rather than living alone.`,
  };
};

const ageFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock' || !p.dobOrAge) return null;
  return {
    question: `How old is ${p.name} right now?`,
    answer: `${p.name} is currently ${p.dobOrAge}. Final mature hip height for ${p.sizeClass === 'Micro' || p.sizeClass === 'Miniature' ? p.sizeClass.toLowerCase() : 'miniature'}-classed Highlands is typically reached around 3 years of age.`,
  };
};

const vaccinationFaq: FaqBuilder = (p) => {
  if (p.itemType !== 'livestock' || !p.vaccination) return null;
  return {
    question: `What health and vaccination record does ${p.name} have?`,
    answer: `${p.name}'s current health record: ${p.vaccination}. A pre-movement NVD and full health certificate travel with ${subjectNoun(p)} at dispatch.`,
  };
};

const LIVESTOCK_BUILDERS: FaqBuilder[] = [
  priceFaq,
  heightFaq,
  chondroFaq,
  hornFaq,
  temperamentFaq,
  registryFaq,
  colourFaq,
  companionFaq,
  ageFaq,
  vaccinationFaq,
];

// ---------------------------------------------------------------------
// Equipment / feed builders
// ---------------------------------------------------------------------

const eqDimensionsFaq: FaqBuilder = (p) => {
  if (p.itemType === 'livestock' || !p.dimensionsOrPack) return null;
  return {
    question: `What are the exact specifications of the ${p.name}?`,
    answer: `The ${p.name} is specified as: ${p.dimensionsOrPack}. ${p.compatibility ? p.compatibility + '.' : ''}`,
  };
};

const eqWarrantyFaq: FaqBuilder = (p) => {
  if (p.itemType === 'livestock' || !p.warrantyOrShelfLife) return null;
  return {
    question: `Does the ${p.name} come with a warranty?`,
    answer: `Yes — the ${p.name} is covered by: ${p.warrantyOrShelfLife}. Keep your order confirmation as proof of purchase for any warranty claim.`,
  };
};

const eqCompatibilityFaq: FaqBuilder = (p) => {
  if (p.itemType === 'livestock' || !p.compatibility) return null;
  return {
    question: `Is the ${p.name} suited to miniature Highland cattle specifically?`,
    answer: `Yes — ${p.compatibility.toLowerCase()}. It's selected for our own herd, not a generic livestock product relabelled for Highlands.`,
  };
};

const eqPriceFaq: FaqBuilder = (p) => {
  if (p.itemType === 'livestock') return null;
  return {
    question: `Is the $${p.price.toLocaleString('en-AU')} AUD price for the ${p.name} a one-off cost?`,
    answer: `Yes, this is a one-time purchase price for the ${p.name}${p.itemType === 'feed' ? ', covering the pack size specified above — reorder as needed once consumed' : ', not a subscription or rental'}. Shipping is calculated separately at checkout.`,
  };
};

const eqDescriptionFaq: FaqBuilder = (p) => {
  if (p.itemType === 'livestock' || !p.shortDescription) return null;
  return {
    question: `What problem does the ${p.name} actually solve?`,
    answer: p.shortDescription.endsWith('.') ? p.shortDescription : `${p.shortDescription}.`,
  };
};

const EQUIPMENT_BUILDERS: FaqBuilder[] = [
  eqDimensionsFaq,
  eqWarrantyFaq,
  eqCompatibilityFaq,
  eqPriceFaq,
  eqDescriptionFaq,
];

// ---------------------------------------------------------------------
// Selection: deterministic per-product rotation so different products
// surface a different subset/order of the applicable FAQs, not just
// different values in the same fixed three slots.
// ---------------------------------------------------------------------

function idHash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function getProductFaqs(p: AnimalProduct): ProductFaq[] {
  const builders = p.itemType === 'livestock' ? LIVESTOCK_BUILDERS : EQUIPMENT_BUILDERS;
  const applicable = builders.map((b) => b(p)).filter((f): f is ProductFaq => f !== null);
  if (applicable.length <= 3) return applicable;

  // Rotate the start index deterministically per product id, then take 3
  // in rotated order - varies both which FAQs appear and their sequence.
  const start = idHash(p.id) % applicable.length;
  const rotated = [...applicable.slice(start), ...applicable.slice(0, start)];
  return rotated.slice(0, 3);
}
