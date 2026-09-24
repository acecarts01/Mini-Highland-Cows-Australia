// lib/email-templates.ts
// HTML email builders for the reply portal.
//
// Every <table>/<td> below carries BOTH the bgcolor attribute and a
// background-color CSS property, never just one. Outlook and Apple Mail
// default an unstyled nested table to opaque white regardless of the
// parent's background — that mismatch is invisible in a browser preview or
// an emulator and only shows up in a real inbox on a real phone. See
// docs/reply-portal.md.

export interface FormField {
  label: string;
  value: string;
}

const BRAND = {
  charcoal: '#232320',
  parchment: '#fbf9f5',
  gold: '#b08d57',
  forest: '#1c3028',
  white: '#ffffff',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fieldRows(fields: FormField[]): string {
  return fields
    .filter((f) => f.value && f.value.trim().length > 0)
    .map(
      (f) => `
      <tr>
        <td bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment}; padding:10px 14px; border-bottom:1px solid #e5dec9; font-family:Arial,Helvetica,sans-serif; font-size:12px; font-weight:bold; color:#705d48; width:38%; vertical-align:top;">
          ${escapeHtml(f.label)}
        </td>
        <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:10px 14px; border-bottom:1px solid #e5dec9; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${BRAND.charcoal};">
          ${escapeHtml(f.value)}
        </td>
      </tr>`
    )
    .join('');
}

function shell(opts: { preheader: string; title: string; intro: string; fields: FormField[]; footer: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(opts.title)}</title>
</head>
<body bgcolor="${BRAND.parchment}" style="margin:0; padding:0; background-color:${BRAND.parchment};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment};">
    <tr>
      <td align="center" bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment}; padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; max-width:600px; width:100%; border-radius:12px; overflow:hidden; border:1px solid #e5dec9;">
          <tr>
            <td bgcolor="${BRAND.forest}" style="background-color:${BRAND.forest}; padding:20px 24px;">
              <span style="font-family:Georgia,'Times New Roman',serif; font-size:20px; font-weight:bold; color:#e5c07b;">Mini Highland Cows</span>
              <br />
              <span style="font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#c9d6cf; letter-spacing:0.04em;">MHC PTY LTD &bull; Roma, QLD</span>
            </td>
          </tr>
          <tr>
            <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:24px;">
              <h1 style="margin:0 0 12px; font-family:Georgia,'Times New Roman',serif; font-size:19px; color:${BRAND.charcoal};">${escapeHtml(opts.title)}</h1>
              <p style="margin:0 0 18px; font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:1.6; color:#4b4337;">${opts.intro}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; border:1px solid #e5dec9; border-radius:8px; overflow:hidden;">
                ${fieldRows(opts.fields)}
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment}; padding:16px 24px; font-family:Arial,Helvetica,sans-serif; font-size:11px; line-height:1.6; color:#8a8271; border-top:1px solid #e5dec9;">
              ${opts.footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function plainText(title: string, intro: string, fields: FormField[], footer: string): string {
  const lines = fields
    .filter((f) => f.value && f.value.trim().length > 0)
    .map((f) => `${f.label}: ${f.value}`);
  return [title, '', intro, '', ...lines, '', footer].join('\n');
}

/** Sent to the business inbox for every submission. */
export function businessNotificationEmail(args: {
  formLabel: string;
  fields: FormField[];
  submittedAt: string;
}) {
  const title = `New ${args.formLabel}`;
  const intro = `A new ${args.formLabel.toLowerCase()} came in through the website on ${escapeHtml(
    args.submittedAt
  )}. Reply directly to this email to respond — it is already addressed to the sender.`;
  const footer = 'Sent automatically by the Mini Highland Cows website reply portal.';

  return {
    subject: `[Website] ${args.formLabel}`,
    html: shell({ preheader: intro, title, intro, fields: args.fields, footer }),
    text: plainText(title, intro, args.fields, footer),
  };
}

/** Sent to the customer confirming their submission was received. */
export function customerConfirmationEmail(args: {
  name: string;
  formLabel: string;
  fields: FormField[];
}) {
  const title = `We've received your ${args.formLabel.toLowerCase()}`;
  const intro = `Thanks${
    args.name ? `, ${escapeHtml(args.name)}` : ''
  }. Our Roma stud desk has your details below and will be in touch shortly. For anything urgent, WhatsApp or call us directly — details in the footer.`;
  const footer =
    'Mini Highland Cows &bull; MHC PTY LTD &bull; Roma, QLD, Australia &bull; This is an automated confirmation — replies to this address are monitored.';

  return {
    subject: `We've received your ${args.formLabel.toLowerCase()} — Mini Highland Cows`,
    html: shell({ preheader: intro, title, intro, fields: args.fields, footer }),
    text: plainText(title, intro, args.fields, footer),
  };
}

// ---------------------------------------------------------------------------
// Order -> admin -> invoice -> payment emails.
//
// These share BRAND and the bulletproof-table rule above but need a richer
// layout (itemised line, a big CTA button, a settlement box) than the
// simple field-list shell, so they build their own rows directly.

import type { Order } from './orders';
import { aud, paymentLabel } from './orders';

function button(href: string, label: string, opts: { bg?: string; color?: string } = {}): string {
  const bg = opts.bg ?? BRAND.gold;
  const color = opts.color ?? BRAND.charcoal;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="background-color:${bg}; border-radius:8px;">
    <tr><td bgcolor="${bg}" align="center" style="background-color:${bg}; border-radius:8px;">
      <a href="${escapeHtml(href)}" style="display:block; padding:14px 26px; font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:bold; color:${color}; text-decoration:none; border-radius:8px;">${escapeHtml(label)}</a>
    </td></tr>
  </table>`;
}

function orderLedgerRows(order: Order): string {
  const l = order.animal;
  return `<tr>
    <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:12px 0; border-bottom:1px solid #e5dec9; vertical-align:top; font-family:Arial,Helvetica,sans-serif;">
      <div style="font-size:14px; font-weight:bold; color:${BRAND.charcoal};">${escapeHtml(l.name)} (${escapeHtml(l.earTag)})</div>
      <div style="font-size:12px; color:#705d48; padding-top:3px;">${escapeHtml([l.color, l.sizeClass].filter(Boolean).join(' • '))}</div>
    </td>
    <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:12px 0 12px 12px; border-bottom:1px solid #e5dec9; vertical-align:top; text-align:right; white-space:nowrap; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; color:${BRAND.charcoal};">${aud(order.totals.price)}</td>
  </tr>`;
}

function orderTotalsRows(order: Order, opts: { freightNote?: string } = {}): string {
  const t = order.totals;
  const line = (label: string, value: string, strong = false, color = BRAND.charcoal) => `<tr>
    <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:6px 0; font-family:Arial,Helvetica,sans-serif; font-size:${strong ? 16 : 13}px; color:${color}; font-weight:${strong ? 'bold' : 'normal'};">${escapeHtml(label)}</td>
    <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:6px 0; text-align:right; font-family:Arial,Helvetica,sans-serif; font-size:${strong ? 18 : 13}px; color:${color}; font-weight:${strong ? 'bold' : 'normal'}; white-space:nowrap;">${escapeHtml(value)}</td>
  </tr>`;
  return [
    t.discount ? line('Crypto settlement incentive (10%)', `−${aud(t.discount)}`, false, '#1e7a46') : '',
    line('Includes GST (10%)', aud(t.gst), false, '#705d48'),
    line('Freight', opts.freightNote ?? 'Confirmed once payment is received', false, '#705d48'),
    t.depositBalanceDue ? line('Balance due before dispatch', aud(t.depositBalanceDue), false, '#705d48') : '',
    `<tr><td colspan="2" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:4px 0;"><div style="height:1px; background-color:${BRAND.forest};"></div></td></tr>`,
    line(t.depositBalanceDue ? 'Deposit payable now' : 'Total (AUD, GST inclusive)', aud(t.total), true, BRAND.forest),
  ]
    .filter(Boolean)
    .join('');
}

function orderShell(opts: { title: string; preheader: string; badge: string; body: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(opts.title)}</title>
</head>
<body bgcolor="${BRAND.parchment}" style="margin:0; padding:0; background-color:${BRAND.parchment};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment};">
    <tr>
      <td align="center" bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment}; padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; max-width:600px; width:100%; border-radius:12px; overflow:hidden; border:1px solid #e5dec9;">
          <tr>
            <td bgcolor="${BRAND.forest}" style="background-color:${BRAND.forest}; padding:20px 24px; text-align:center;">
              <span style="display:inline-block; padding:5px 12px; border-radius:999px; background-color:${BRAND.gold}; color:${BRAND.forest}; font-family:Arial,Helvetica,sans-serif; font-size:11px; font-weight:bold; text-transform:uppercase; letter-spacing:0.06em;">${escapeHtml(opts.badge)}</span>
              <div style="padding-top:10px; font-family:Georgia,'Times New Roman',serif; font-size:20px; font-weight:bold; color:#e5c07b;">Mini Highland Cows</div>
              <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#c9d6cf; letter-spacing:0.04em;">MHC PTY LTD &bull; Roma, QLD</div>
            </td>
          </tr>
          ${opts.body}
          <tr>
            <td bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment}; padding:16px 24px; font-family:Arial,Helvetica,sans-serif; font-size:11px; line-height:1.6; color:#8a8271; border-top:1px solid #e5dec9;">
              MHC PTY LTD &bull; ABN 23 158 390 973 &bull; Roma, QLD 4455. All prices include 10% GST. Freight is quoted against your delivery postcode.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Sent to the business inbox for every new order, with a button straight into the pre-filled settlement terminal. */
export function adminNewOrderEmail(order: Order, settleUrl: string) {
  const c = order.customer;
  const first = c.name.split(' ')[0];
  const title = `New order ${order.ref}`;
  const body = `
    <tr>
      <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:24px;">
        <h1 style="margin:0 0 12px; font-family:Georgia,'Times New Roman',serif; font-size:19px; color:${BRAND.charcoal};">${escapeHtml(title)}</h1>
        <p style="margin:0 0 14px; font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:1.6; color:#4b4337;">
          <strong>${escapeHtml(c.name)}</strong> &bull; ${escapeHtml(c.email)}${c.phone ? ` &bull; ${escapeHtml(c.phone)}` : ''}<br />
          ${c.postcode ? `${escapeHtml(c.postcode)}${c.state ? ` (${escapeHtml(c.state)})` : ''} &bull; ` : ''}${escapeHtml(paymentLabel(order.payment))}
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; border:1px solid #e5dec9; border-radius:8px; overflow:hidden; padding:0 14px;">
          ${orderLedgerRows(order)}${orderTotalsRows(order)}
        </table>
        <div style="padding-top:18px;">${button(settleUrl, 'View Order in Admin')}</div>
        <p style="margin:10px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#8a8271;">Opens the settlement terminal with the payment details ready to fill in and send &middot; requires the admin passphrase.</p>
      </td>
    </tr>`;
  const html = orderShell({ title, preheader: `${c.name} • ${aud(order.totals.total)} • ${paymentLabel(order.payment)}`, badge: 'New Order', body });
  const text = [
    `NEW ORDER ${order.ref}`,
    `${c.name} · ${c.email} · ${c.phone ?? '-'}`,
    `Animal: ${order.animal.name} (${order.animal.earTag})`,
    `Payment: ${paymentLabel(order.payment)}`,
    `Total: ${aud(order.totals.total)}`,
    ``,
    `Settle: ${settleUrl}`,
  ].join('\n');
  return { subject: `NEW ORDER ${order.ref} — ${c.name} — ${aud(order.totals.total)}`, html, text };
}

/** Sent to the customer immediately after they place an order. */
export function orderConfirmationEmail(order: Order) {
  const c = order.customer;
  const first = c.name.split(' ')[0];
  const title = `Thank you, ${first}.`;
  const intro = `Order <strong>${escapeHtml(order.ref)}</strong> for <strong>${escapeHtml(order.animal.name)}</strong> is logged and reserved at our Roma QLD stud. Your official payment invoice follows shortly.`;
  const body = `
    <tr>
      <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:24px;">
        <h1 style="margin:0 0 12px; font-family:Georgia,'Times New Roman',serif; font-size:19px; color:${BRAND.charcoal};">${title}</h1>
        <p style="margin:0 0 14px; font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:1.6; color:#4b4337;">${intro}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; border:1px solid #e5dec9; border-radius:8px; overflow:hidden; padding:0 14px;">
          ${orderLedgerRows(order)}${orderTotalsRows(order)}
        </table>
        <p style="margin:14px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:1.6; color:#4b4337;">
          Once you've paid and sent the receipt on WhatsApp, we confirm your freight to your postcode and book dispatch.
        </p>
      </td>
    </tr>`;
  const html = orderShell({ title: `Order ${order.ref} confirmed — Mini Highland Cows`, preheader: `Order ${order.ref} logged and reserved. Your invoice follows shortly.`, badge: 'Order Confirmation', body });
  const text = [
    `${title} Order ${order.ref} for ${order.animal.name} is logged and reserved.`,
    `Total ${aud(order.totals.total)} (${paymentLabel(order.payment)})`,
    ``,
    `We'll send your official payment invoice shortly.`,
  ].join('\n');
  return { subject: `Order ${order.ref} confirmed — Mini Highland Cows`, html, text };
}

function valueBox(label: string, value: string): string {
  return `<tr><td bgcolor="${BRAND.forest}" style="background-color:${BRAND.forest}; padding:0 0 10px 0;">
    <div style="font-family:Arial,Helvetica,sans-serif; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:#c9d6cf; padding-bottom:4px;">${escapeHtml(label)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#132a22" style="background-color:#132a22; border-radius:8px;">
      <tr><td bgcolor="#132a22" style="background-color:#132a22; padding:10px 12px; border:1px solid ${BRAND.gold}; border-radius:8px; font-family:'Courier New',Courier,monospace; font-size:14px; color:${BRAND.white}; word-break:break-all;">${escapeHtml(value)}</td></tr>
    </table>
  </td></tr>`;
}

function settlementRows(order: Order): string {
  const inv = order.invoice;
  if (!inv) return '';
  if (inv.method === 'bank' && inv.bank) {
    return (
      valueBox('Account name', inv.bank.accountName) +
      valueBox('BSB', inv.bank.bsb) +
      valueBox('Account number', inv.bank.accountNumber) +
      (inv.bank.payId ? valueBox('PayID', inv.bank.payId) : '') +
      valueBox('Payment reference (required)', order.ref)
    );
  }
  if (inv.method === 'crypto' && inv.crypto) {
    return (
      valueBox(`${inv.crypto.asset} · ${inv.crypto.network}`, inv.crypto.address) +
      `<tr><td bgcolor="${BRAND.forest}" style="background-color:${BRAND.forest}; padding:2px 0 8px 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:1.5; color:#c9d6cf;">Send the ${escapeHtml(inv.crypto.asset)} equivalent of <strong style="color:${BRAND.white};">${aud(order.totals.total)}</strong> at the rate your wallet shows when you send. Check the network before sending — a transfer on the wrong network cannot be recovered.</td></tr>`
    );
  }
  return '';
}

const METHOD_TITLE: Record<'bank' | 'crypto', string> = { bank: 'Bank transfer · PayID / EFT', crypto: 'Crypto settlement' };

/** The official tax invoice with the payment settlement box, sent once the admin sends it from the settlement terminal. */
export function renderInvoiceEmail(order: Order, payUrl: string) {
  const c = order.customer;
  const inv = order.invoice;
  const first = c.name.split(' ')[0];
  const title = `Invoice ${order.ref}`;
  const body = `
    <tr>
      <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:24px;">
        <h1 style="margin:0 0 12px; font-family:Georgia,'Times New Roman',serif; font-size:19px; color:${BRAND.charcoal};">${title}</h1>
        <p style="margin:0 0 14px; font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:1.6; color:#4b4337;">Hi ${escapeHtml(first)} — your ${escapeHtml(order.animal.name)} is reserved. Settle using the details below and we book dispatch.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; border:1px solid #e5dec9; border-radius:8px; overflow:hidden; padding:0 14px; margin-bottom:16px;">
          ${orderLedgerRows(order)}${orderTotalsRows(order, { freightNote: 'Confirmed once payment is received' })}
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.forest}" style="background-color:${BRAND.forest}; border-radius:8px; border:1px solid ${BRAND.gold};">
          <tr><td bgcolor="${BRAND.forest}" style="background-color:${BRAND.forest}; padding:18px 18px 10px 18px;">
            <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:#e5c07b; font-weight:bold;">Payment settlement</div>
            <div style="font-family:Georgia,'Times New Roman',serif; font-size:18px; color:${BRAND.white}; padding:6px 0 12px 0;">${escapeHtml(inv ? METHOD_TITLE[inv.method] : 'Payment details')}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.forest}" style="background-color:${BRAND.forest};">${settlementRows(order)}</table>
            <div style="padding:8px 0 4px 0;">${button(payUrl, 'Open invoice · copy details · QR code')}</div>
            ${inv?.notes ? `<div style="font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:1.5; color:${BRAND.white}; padding-top:10px; border-top:1px solid rgba(255,255,255,0.15); margin-top:10px;">${escapeHtml(inv.notes)}</div>` : ''}
          </td></tr>
        </table>
      </td>
    </tr>`;
  const html = orderShell({ title: `Tax invoice ${order.ref} — Mini Highland Cows`, preheader: `Invoice ${order.ref}: ${aud(order.totals.total)} payable.`, badge: 'Tax Invoice · Payment Due', body });
  const payLines: string[] = [];
  if (inv?.method === 'bank' && inv.bank) payLines.push(`Account name: ${inv.bank.accountName}`, `BSB: ${inv.bank.bsb}`, `Account: ${inv.bank.accountNumber}`, inv.bank.payId ? `PayID: ${inv.bank.payId}` : '', `Reference: ${order.ref}`);
  if (inv?.method === 'crypto' && inv.crypto) payLines.push(`${inv.crypto.asset} (${inv.crypto.network}): ${inv.crypto.address}`);
  const text = [
    `TAX INVOICE ${order.ref} — MHC PTY LTD`,
    `${order.animal.name} — ${aud(order.totals.total)} (incl. GST ${aud(order.totals.gst)})`,
    ``,
    ...payLines.filter(Boolean),
    ``,
    `Full invoice: ${payUrl}`,
  ].join('\n');
  return { subject: `Tax invoice ${order.ref} — ${aud(order.totals.total)} — Mini Highland Cows`, html, text };
}
