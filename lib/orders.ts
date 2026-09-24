// Server-only order helpers: pricing (reads real prices, never trusts the
// client) and signed tokens. Browser-safe types/labels live in
// lib/orders-shared.ts — this file must never be imported from a 'use
// client' component, or node:crypto breaks the browser bundle.
//
// An order's authority is a signed token that travels in the links and
// emails about it. The token is HMAC-SHA256 over the JSON payload with
// ORDER_SIGNING_SECRET, so a link cannot be forged or edited, and every
// admin page and API verifies it before trusting a byte. lib/db.ts mirrors
// each order into Postgres, keyed by the same ref, purely so the admin
// portal has something to list - the token is still what proves an order's
// contents and grants access to it, never the database row.
//
// Ported from the same pattern used on golfbuggiesexpress.com.au (repo
// The-Buggies-Shop), adapted for one animal per order (no shopping cart).

import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { ALL_PRODUCTS, SITE, AnimalProduct } from '@/lib/site-config';

export * from './orders-shared';
import { type Order, type OrderAnimal, type OrderTotals, type PaymentMethod } from './orders-shared';

export function newOrderRef(now = new Date()): string {
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  // 5 bytes = 10 hex chars: this is a database primary key (lib/db.ts), so a
  // same-day collision wouldn't just look odd - it would silently overwrite
  // a different customer's order.
  return `MHC-${stamp}-${randomBytes(5).toString('hex').toUpperCase()}`;
}

/** Build the priced animal + totals from a client-supplied animal id. Price always comes from ALL_PRODUCTS, never the client. */
export function priceOrder(animalId: string, payment: PaymentMethod): { animal: OrderAnimal; totals: OrderTotals } | null {
  const p = ALL_PRODUCTS.find((x: AnimalProduct) => x.id === animalId || x.slug === animalId);
  if (!p) return null;
  const animal: OrderAnimal = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    earTag: `MHC-QLD-${p.id.replace(/\D/g, '')}`,
    image: p.image,
    color: p.color,
    sizeClass: p.sizeClass,
  };
  const price = p.price;
  const discount = payment === 'crypto' ? Math.round(price * 0.1) : 0;
  const afterDiscount = price - discount;
  const total = payment === 'deposit' ? Math.round(price * 0.2) : afterDiscount;
  const totals: OrderTotals = {
    price,
    discount,
    total,
    gst: Math.round((total / 11) * 100) / 100,
    ...(payment === 'deposit' ? { depositBalanceDue: price - total } : {}),
  };
  return { animal, totals };
}

// ---------------------------------------------------------------------------
// Signed tokens

function secret(): string {
  const s = process.env.ORDER_SIGNING_SECRET;
  if (!s || s.length < 16) throw new Error('ORDER_SIGNING_SECRET is not set (min 16 chars)');
  return s;
}

const b64u = (b: Buffer) => b.toString('base64url');

export function signOrder(order: Order): string {
  const payload = b64u(Buffer.from(JSON.stringify(order), 'utf8'));
  const sig = b64u(createHmac('sha256', secret()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifyOrder(token: string | null | undefined): Order | null {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = b64u(createHmac('sha256', secret()).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const order = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Order;
    if (!order.ref || !order.animal) return null;
    return order;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// URLs

export function siteUrl(): string {
  // Preview deployments get a fresh *.vercel.app URL every push; VERCEL_URL is
  // set automatically by Vercel to that exact deployment's own host. This
  // must be checked BEFORE NEXT_PUBLIC_SITE_URL, which is set to the
  // production domain for both Production and Preview (for canonical SEO
  // tags) — checking it first would send every order/admin/invoice/pay link
  // in a Preview email to the production domain, which isn't running this
  // branch's code yet.
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return `https://${SITE.domain}`;
}

export function adminOrderUrl(token: string): string {
  return `${siteUrl()}/admin/orders?o=${encodeURIComponent(token)}`;
}
export function settleUrl(token: string): string {
  return `${siteUrl()}/admin/orders/settle?o=${encodeURIComponent(token)}`;
}
export function payPageUrl(token: string): string {
  return `${siteUrl()}/pay?i=${encodeURIComponent(token)}`;
}
