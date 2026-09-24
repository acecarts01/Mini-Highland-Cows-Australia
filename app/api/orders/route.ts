// POST /api/orders — the order-now form's submission.
//
// Price is always recomputed server-side from ALL_PRODUCTS via priceOrder();
// the client only ever sends an animal id and a payment method, never a
// price. Two emails go out: the customer's confirmation and the business's
// copy carrying the signed "View Order in Admin" link straight into the
// pre-filled settlement terminal. The admin token is never returned to the
// browser — only the order ref and a WhatsApp fallback URL are.
import { NextResponse } from 'next/server';
import {
  type Order,
  type PaymentMethod,
  newOrderRef,
  priceOrder,
  signOrder,
  settleUrl,
  whatsappOrderUrl,
} from '@/lib/orders';
import { adminNewOrderEmail, orderConfirmationEmail } from '@/lib/email-templates';
import { isMailerConfigured, sendMail } from '@/lib/mailer';
import { CONTACT } from '@/lib/site-config';
import { upsertOrder } from '@/lib/db';

export const runtime = 'nodejs';

const PAYMENTS: PaymentMethod[] = ['bank', 'crypto', 'deposit'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: a bot that fills every field will fill this one too.
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const name = String(body.name ?? '').trim().slice(0, 120);
  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 160);
  const phone = String(body.phone ?? '').trim().slice(0, 40) || undefined;
  const address = String(body.address ?? '').trim().slice(0, 200) || undefined;
  const suburb = String(body.suburb ?? '').trim().slice(0, 100) || undefined;
  const state = String(body.state ?? '').trim().slice(0, 10) || undefined;
  const postcode = String(body.postcode ?? '').trim().slice(0, 4) || undefined;
  const paddockAccessNotes = String(body.paddockAccessNotes ?? '').trim().slice(0, 400) || undefined;
  const picNumber = String(body.picNumber ?? '').trim().slice(0, 40) || undefined;
  const needPicHelp = Boolean(body.needPicHelp);
  const payment = PAYMENTS.includes(body.payment as PaymentMethod) ? (body.payment as PaymentMethod) : 'bank';
  const animalId = String(body.animalId ?? '').trim();

  if (!name) return NextResponse.json({ success: false, message: 'Please enter your full name.' }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ success: false, message: 'A valid email address is required so we can send your confirmation.' }, { status: 400 });

  const priced = priceOrder(animalId, payment);
  if (!priced) return NextResponse.json({ success: false, message: 'That animal could not be found — please pick again.' }, { status: 400 });

  if (!isMailerConfigured()) {
    console.error('[orders] ZOHO_SMTP_USER / ZOHO_SMTP_PASS are not configured.');
    return NextResponse.json(
      { success: false, message: 'Orders cannot be emailed right now. Please contact us via WhatsApp or phone instead.' },
      { status: 503 }
    );
  }

  const order: Order = {
    ref: newOrderRef(),
    createdAt: new Date().toISOString(),
    status: 'new',
    customer: { name, email, phone, address, suburb, state, postcode, paddockAccessNotes, picNumber, needPicHelp },
    animal: priced.animal,
    payment,
    totals: priced.totals,
  };

  const token = signOrder(order);
  const confirmation = orderConfirmationEmail(order);
  const adminMail = adminNewOrderEmail(order, settleUrl(token));

  try {
    await sendMail({ to: email, subject: confirmation.subject, html: confirmation.html, text: confirmation.text });
  } catch (err) {
    console.error('[orders] failed to send customer confirmation:', err);
    return NextResponse.json(
      { success: false, message: 'Could not send your order confirmation. Please contact us via WhatsApp or phone instead.' },
      { status: 502 }
    );
  }

  try {
    await sendMail({ to: CONTACT.email, subject: adminMail.subject, html: adminMail.html, text: adminMail.text, replyTo: email });
  } catch (err) {
    console.error('[orders] business order-alert failed to send:', err);
  }

  await upsertOrder(order, 'Order placed');

  return NextResponse.json({ success: true, ref: order.ref, whatsappUrl: whatsappOrderUrl(order) });
}
