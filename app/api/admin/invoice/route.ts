import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/admin-auth';
import { type InvoiceDetails, type Order, verifyOrder, signOrder, payPageUrl, adminOrderUrl } from '@/lib/orders';
import { renderInvoiceEmail } from '@/lib/email-templates';
import { sendMail } from '@/lib/mailer';
import { CONTACT, CRYPTO } from '@/lib/site-config';
import { getOrder, upsertOrder } from '@/lib/db';

// POST /api/admin/invoice?preview=1  -> { html }               (live preview)
// POST /api/admin/invoice             -> sends the invoice, returns the
//                                        invoice_sent token + pay/admin URLs
// Body: { token, invoice: InvoiceDetails }

function cleanInvoice(raw: Partial<InvoiceDetails> | undefined, order: Order): InvoiceDetails | { error: string } {
  const method = raw?.method;
  if (method !== 'bank' && method !== 'crypto') return { error: 'Choose a payment method.' };
  const s = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);
  const inv: InvoiceDetails = {
    issuedAt: new Date().toISOString(),
    method,
    notes: s(raw?.notes, 600) || undefined,
  };

  if (method === 'bank') {
    const b: Partial<NonNullable<InvoiceDetails['bank']>> = raw?.bank ?? {};
    const accountName = s(b.accountName, 80);
    const bsb = s(b.bsb, 12).replace(/[^\d-]/g, '');
    const accountNumber = s(b.accountNumber, 20).replace(/[^\d]/g, '');
    if (!accountName || !/^\d{3}-?\d{3}$/.test(bsb) || accountNumber.length < 5) {
      return { error: 'Bank transfer needs an account name, a 6-digit BSB and an account number.' };
    }
    inv.bank = { accountName, bsb: bsb.includes('-') ? bsb : `${bsb.slice(0, 3)}-${bsb.slice(3)}`, accountNumber, payId: s(b.payId, 80) || undefined };
  }
  if (method === 'crypto') {
    const w = CRYPTO.wallets.find((x) => x.key === raw?.crypto?.walletKey);
    if (!w) return { error: 'Pick one of the configured settlement wallets.' };
    inv.crypto = { walletKey: w.key, asset: w.asset, network: w.network, address: w.address };
    if (order.payment !== 'crypto') return { error: 'This order was not placed with the crypto discount; re-price it before invoicing in crypto.' };
  }
  return inv;
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (!verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ success: false, message: 'Not signed in.' }, { status: 401 });
  }
  const url = new URL(request.url);
  const preview = url.searchParams.get('preview') === '1';

  let body: { token?: string; invoice?: Partial<InvoiceDetails> } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }
  const order = verifyOrder(body.token);
  if (!order) return NextResponse.json({ success: false, message: 'Invalid order token.' }, { status: 400 });

  // The database is the live source of truth for status - never let a
  // resend regress it if an admin reuses a stale email link.
  if (!preview) {
    const live = await getOrder(order.ref).catch(() => null);
    if (live && (live.status === 'paid' || live.status === 'dispatched')) {
      return NextResponse.json({ success: false, message: `This order is already marked ${live.status}. Open it from the portal for a current link before resending an invoice.` }, { status: 409 });
    }
  }

  const cleaned = cleanInvoice(body.invoice, order);
  if ('error' in cleaned) {
    if (preview) {
      const draft: Order = { ...order, invoice: { issuedAt: new Date().toISOString(), method: (body.invoice?.method as InvoiceDetails['method']) || 'bank', ...(body.invoice as Partial<InvoiceDetails>) } as InvoiceDetails };
      const t = signOrder({ ...draft, status: 'invoice_sent' });
      return NextResponse.json({ success: true, html: renderInvoiceEmail(draft, payPageUrl(t)).html, incomplete: cleaned.error });
    }
    return NextResponse.json({ success: false, message: cleaned.error }, { status: 400 });
  }

  const invoiced: Order = { ...order, status: 'invoice_sent', invoice: cleaned };
  const newToken = signOrder(invoiced);
  const payUrl = payPageUrl(newToken);
  const mail = renderInvoiceEmail(invoiced, payUrl);

  if (preview) return NextResponse.json({ success: true, html: mail.html });

  try {
    await sendMail({ to: order.customer.email, subject: mail.subject, html: mail.html, text: mail.text, bcc: CONTACT.email });
  } catch (err) {
    return NextResponse.json({ success: false, message: `Could not send the invoice email: ${(err as Error).message}` }, { status: 502 });
  }
  await upsertOrder(invoiced, 'Invoice sent');

  return NextResponse.json({
    success: true,
    token: newToken,
    payUrl,
    adminUrl: adminOrderUrl(newToken),
  });
}
