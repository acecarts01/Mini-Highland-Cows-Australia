// WebMCP tool declarations so browser-based AI agents can discover site
// actions. Read-only navigation only — no tool here places an order or
// mutates state, matching the human-ordering-only stance in auth.md and
// the MCP server card.

import { SITE, CONTACT } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const shopUrl = absoluteUrl('/shop');
  const herdUrl = absoluteUrl('/herd');
  const faqUrl = absoluteUrl('/faq');
  const contactUrl = absoluteUrl('/contact');
  const orderUrl = absoluteUrl('/order-now');
  const waNumber = CONTACT.whatsapp.replace('+', '');

  const body = `(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;

  navigator.modelContext.provideContext({
    tools: [
      {
        name: "browse_catalog",
        description: "Browse the ${SITE.name} product catalog (livestock and equipment).",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = ${JSON.stringify(shopUrl)};
          return { url: ${JSON.stringify(shopUrl)} };
        }
      },
      {
        name: "view_available_herd",
        description: "View the live-availability list of cattle currently for sale.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = ${JSON.stringify(herdUrl)};
          return { url: ${JSON.stringify(herdUrl)} };
        }
      },
      {
        name: "start_order",
        description: "Open the order/reservation form for a specific animal. A human must complete this form themselves - there is no agent-callable order API.",
        inputSchema: {
          type: "object",
          properties: { animalId: { type: "string", description: "The animal's product id, e.g. mhc-05" } }
        },
        execute: async ({ animalId }) => {
          const url = animalId ? ${JSON.stringify(orderUrl)} + "?animal=" + encodeURIComponent(animalId) : ${JSON.stringify(orderUrl)};
          window.location.href = url;
          return { url: url };
        }
      },
      {
        name: "read_faq",
        description: "Open the buyer FAQ (acreage, PIC registration, NLIS transfer, Chondro genetics, delivery, payment).",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = ${JSON.stringify(faqUrl)};
          return { url: ${JSON.stringify(faqUrl)} };
        }
      },
      {
        name: "contact",
        description: "Open the contact page for availability, transport quotes, or paperwork questions.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = ${JSON.stringify(contactUrl)};
          return { url: ${JSON.stringify(contactUrl)} };
        }
      }
    ]
  });
})();
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
