'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Copy, Check, MessageSquare, Mail, ShieldCheck } from 'lucide-react';
import { type Order, aud, whatsappReceiptUrl } from '@/lib/orders-shared';
import { SITE, CONTACT } from '@/lib/site-config';

function CopyField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setOk(true);
      setTimeout(() => setOk(false), 1800);
    } catch {
      /* value is selectable */
    }
  };
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-[#a9b4a2] mb-1">{label}</div>
      <div className="flex items-stretch gap-2">
        <code className={`flex-1 min-w-0 break-all px-3 py-2.5 rounded-lg bg-[#0f1a15] border border-[#b08d57] text-white text-sm ${mono ? 'font-mono' : ''} select-all`}>{value}</code>
        <button type="button" onClick={copy} aria-label={`Copy ${label}`} className="shrink-0 px-3 rounded-lg bg-[#b08d57] hover:bg-[#c9a367] text-[#1c3028] transition-colors cursor-pointer">
          {ok ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function PayInvoice({ order }: { order: Order | null }) {
  const [qr, setQr] = useState('');
  const inv = order?.invoice;

  useEffect(() => {
    if (!order || inv?.method !== 'crypto' || !inv.crypto) return;
    const payload = inv.crypto.asset === 'BTC' ? `bitcoin:${inv.crypto.address}?label=${encodeURIComponent(`Mini Highland Cows ${order.ref}`)}` : inv.crypto.address;
    QRCode.toDataURL(payload, { margin: 1, width: 200, color: { dark: '#1c3028', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [order, inv]);

  if (!order || !inv) {
    return (
      <main id="main" className="min-h-screen bg-[#0f1a15] text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-serif font-bold">This invoice link isn&rsquo;t valid</h1>
          <p className="text-sm text-[#a9b4a2]">Open the link from your invoice email, or message the sales desk on WhatsApp and we&rsquo;ll resend it.</p>
        </div>
      </main>
    );
  }

  const c = order.customer;
  const grand = order.totals.total;

  return (
    <main id="main" className="min-h-screen bg-[#0f1a15] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-5">
        <header className="bg-[#1c3028] border border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b08d57] text-[#1c3028] text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1c3028] animate-pulse" /> Tax invoice &middot; payment due
          </span>
          <h1 className="text-xl sm:text-3xl font-serif font-bold break-words">Invoice {order.ref}</h1>
          <p className="text-sm text-[#a9b4a2]">Hi {c.name.split(' ')[0]} — your {order.animal.name} is reserved at Roma. Settle below and we book dispatch.</p>
        </header>

        <section className="bg-white text-[#232320] rounded-2xl p-6 sm:p-8 space-y-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Invoice to</dt><dd className="font-semibold">{c.name}<br /><span className="font-normal">{c.email}</span></dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Deliver to</dt><dd>{c.postcode ? `${c.suburb ?? ''} ${c.state ?? ''} ${c.postcode}` : 'To be confirmed'}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Supplier</dt><dd>{SITE.companyName}<br />ABN {SITE.abn} &middot; Roma QLD 4455</dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Issued</dt><dd>{new Date(inv.issuedAt).toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'long' })}</dd></div>
          </dl>
          <div className="border-t border-[#e5dec9]">
            <div className="py-3 border-b border-[#e5dec9] flex justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-bold">{order.animal.name}</div>
                <div className="text-xs text-gray-500">{order.animal.earTag} &middot; {[order.animal.color, order.animal.sizeClass].filter(Boolean).join(' • ')}</div>
              </div>
              <div className="font-bold whitespace-nowrap shrink-0 text-right">{aud(order.totals.price)}</div>
            </div>
          </div>
          <dl className="text-sm space-y-1">
            {order.totals.discount > 0 && <div className="flex justify-between text-[#1e7a46]"><dt>Crypto settlement incentive (10%)</dt><dd>&minus;{aud(order.totals.discount)}</dd></div>}
            <div className="flex justify-between text-gray-500"><dt>Includes GST (10%)</dt><dd>{aud(order.totals.gst)}</dd></div>
            <div className="flex justify-between text-gray-500"><dt>Freight</dt><dd>Confirmed once payment is received</dd></div>
            {order.totals.depositBalanceDue !== undefined && <div className="flex justify-between text-gray-500"><dt>Balance due before dispatch</dt><dd>{aud(order.totals.depositBalanceDue)}</dd></div>}
            <div className="flex justify-between text-lg font-bold text-[#1c3028] pt-2 border-t border-[#1c3028]"><dt>Amount payable</dt><dd>{aud(grand)}</dd></div>
          </dl>
        </section>

        <section className="bg-[#152420] border border-[#b08d57] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#e5c07b] font-bold">Payment settlement</div>
          {inv.method === 'bank' && inv.bank && (
            <div className="space-y-3">
              <h2 className="text-lg font-serif font-bold">Bank transfer &middot; PayID / EFT</h2>
              <CopyField label="Account name" value={inv.bank.accountName} mono={false} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CopyField label="BSB" value={inv.bank.bsb} />
                <CopyField label="Account number" value={inv.bank.accountNumber} />
              </div>
              {inv.bank.payId && <CopyField label="PayID" value={inv.bank.payId} mono={false} />}
              <CopyField label="Payment reference (required)" value={order.ref} />
              <CopyField label="Amount" value={String(grand)} />
            </div>
          )}
          {inv.method === 'crypto' && inv.crypto && (
            <div className="space-y-3">
              <h2 className="text-lg font-serif font-bold">{inv.crypto.asset} &middot; {inv.crypto.network}</h2>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt={`QR code for the ${inv.crypto.asset} address`} width={160} height={160} className="rounded-lg border border-white/15 bg-white shrink-0" />
                ) : (
                  <div className="w-40 h-40 rounded-lg border border-white/15" />
                )}
                <div className="flex-1 min-w-0 space-y-3">
                  <CopyField label={`${inv.crypto.asset} address`} value={inv.crypto.address} />
                  <p className="text-xs text-[#a9b4a2] leading-relaxed">Send the {inv.crypto.asset} equivalent of <strong className="text-white">{aud(order.totals.total)}</strong> at the rate your wallet shows when you send. Check the network first — a transfer on the wrong network cannot be recovered. Only ever use an address shown on this site.</p>
                </div>
              </div>
            </div>
          )}
          {inv.notes && <p className="text-xs text-[#e7ecdf] border-t border-white/15 pt-3 leading-relaxed">{inv.notes}</p>}
          <div className="pt-2 space-y-2">
            <a href={whatsappReceiptUrl(order)} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1e7a46] hover:bg-[#25984f] text-white font-bold text-sm transition-colors">
              <MessageSquare className="w-4 h-4" /> Confirm Payment &amp; Get Tracking
            </a>
            <p className="text-[11px] text-[#a9b4a2] text-center">Sends your receipt or a screenshot on WhatsApp — once we confirm it, we mark your order paid and organise dispatch tracking. Questions: <a href={`mailto:${CONTACT.email}`} className="text-[#e5c07b] hover:underline inline-flex items-center gap-1"><Mail className="w-3 h-3" />{CONTACT.email}</a></p>
          </div>
        </section>

        <footer className="text-center text-[11px] text-[#a9b4a2] space-y-1">
          <p className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#b08d57]" /> {SITE.companyName} &middot; ABN {SITE.abn} &middot; Roma QLD 4455</p>
          <p>All prices include 10% GST. <Link href="/faq" className="underline hover:text-[#e5c07b]">FAQ</Link> &middot; <Link href="/contact" className="underline hover:text-[#e5c07b]">Contact</Link></p>
        </footer>
      </div>
    </main>
  );
}
