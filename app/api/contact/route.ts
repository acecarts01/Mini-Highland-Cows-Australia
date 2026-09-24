// app/api/contact/route.ts
// The reply portal: one endpoint behind every form on the site (contact,
// order-now, the order modal, and the enquiry drawer). It sends a
// notification to the business inbox with Reply-To set to the customer, and
// a confirmation to the customer, over Zoho SMTP.
//
// See docs/reply-portal.md for the contract, setup steps and how to test it.

import { NextResponse } from 'next/server';
import { CONTACT } from '@/lib/site-config';
import { isMailerConfigured, sendMail } from '@/lib/mailer';
import { businessNotificationEmail, customerConfirmationEmail, type FormField } from '@/lib/email-templates';

export const runtime = 'nodejs';

const FORM_LABELS: Record<string, string> = {
  contact: 'Contact Enquiry',
  order: 'Livestock Order',
  enquiry: 'Reservation Enquiry',
};

interface ContactRequestBody {
  formType: keyof typeof FORM_LABELS;
  name: string;
  email: string;
  fields: FormField[];
  /** Honeypot — real users never fill this in. */
  website?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: ContactRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: a bot that fills every field will fill this one too. Report
  // success without sending anything, so the bot doesn't learn to skip it.
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const formLabel = FORM_LABELS[body.formType];
  if (!formLabel) {
    return NextResponse.json({ success: false, message: 'Unknown form type.' }, { status: 400 });
  }

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ success: false, message: 'Name is required.' }, { status: 400 });
  }
  if (!body.email || !isValidEmail(body.email)) {
    return NextResponse.json({ success: false, message: 'A valid email address is required.' }, { status: 400 });
  }
  if (!Array.isArray(body.fields)) {
    return NextResponse.json({ success: false, message: 'Malformed submission.' }, { status: 400 });
  }

  if (!isMailerConfigured()) {
    // Not a client bug — the deployment is missing ZOHO_SMTP_USER/PASS.
    // Fail loudly server-side, fail clearly (not silently "successfully")
    // to the client.
    console.error('[reply-portal] ZOHO_SMTP_USER / ZOHO_SMTP_PASS are not configured.');
    return NextResponse.json(
      {
        success: false,
        message: 'Enquiries cannot be emailed right now. Please contact us via WhatsApp or phone instead.',
      },
      { status: 503 }
    );
  }

  const submittedAt = new Date().toLocaleString('en-AU', {
    timeZone: 'Australia/Brisbane',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const businessEmail = businessNotificationEmail({ formLabel, fields: body.fields, submittedAt });
  const customerEmail = customerConfirmationEmail({ name: body.name, formLabel, fields: body.fields });

  try {
    // Business copy first: if only one email can succeed, the enquiry must
    // not be lost, even if the customer's confirmation later fails.
    await sendMail({
      to: CONTACT.email,
      subject: businessEmail.subject,
      html: businessEmail.html,
      text: businessEmail.text,
      replyTo: body.email,
    });
  } catch (err) {
    console.error('[reply-portal] failed to deliver business notification:', err);
    return NextResponse.json(
      { success: false, message: 'Could not send your enquiry. Please contact us via WhatsApp or phone instead.' },
      { status: 502 }
    );
  }

  try {
    await sendMail({
      to: body.email,
      subject: customerEmail.subject,
      html: customerEmail.html,
      text: customerEmail.text,
    });
  } catch (err) {
    // The business already has the enquiry — this is a real failure, but
    // not one that should tell the customer their enquiry didn't arrive.
    console.error('[reply-portal] business notification sent, but customer confirmation failed:', err);
  }

  return NextResponse.json({ success: true });
}
