// POST /api/orders/receipt — fired the instant a customer clicks "WhatsApp
// Receipt" or "Email Receipt" on the pay page. Sends them an immediate
// acknowledgement and logs it on the order's activity log. This is
// deliberately NOT the same thing as marking an order Paid — that stays a
// separate admin action once the business has actually checked the receipt;
// this route only tells the customer their notice was received while they
// wait, and gives the admin a timestamped note that a receipt is coming.
import { NextResponse } from 'next/server';
import { verifyOrder } from '@/lib/orders';
import { paymentReceiptAckEmail } from '@/lib/email-templates';
import { sendMail } from '@/lib/mailer';
import { logOrderEvent } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { token?: string; method?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const order = verifyOrder(body.token);
  if (!order) return NextResponse.json({ success: false }, { status: 400 });

  const method = body.method === 'email' ? 'email' : 'whatsapp';
  const mail = paymentReceiptAckEmail(order, method);

  try {
    await sendMail({ to: order.customer.email, subject: mail.subject, html: mail.html, text: mail.text });
  } catch (err) {
    console.error('[orders/receipt] failed to send acknowledgement:', err);
    return NextResponse.json({ success: false }, { status: 502 });
  }

  await logOrderEvent(order.ref, `Customer said they've paid, via ${method}`);

  return NextResponse.json({ success: true });
}
