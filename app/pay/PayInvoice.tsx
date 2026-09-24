'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { Copy, Check, MessageSquare, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { type Order, aud, whatsappReceiptUrl, mailtoReceiptUrl } from '@/lib/orders-shared';
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
      <div className="text-[10px] uppercase tracking-[0.14em] text-[#705d48] mb-1 font-bold">{label}</div>
      <div className="flex items-stretch gap-2">
        <code className={`flex-1 min-w-0 break-all px-3 py-2.5 rounded-xl bg-white border border-[#e5dec9] text-[#232320] text-sm ${mono ? 'font-mono' : ''} select-all shadow-xs`}>{value}</code>
        <motion.button
          type="button"
          onClick={copy}
          whileTap={{ scale: 0.9 }}
          aria-label={`Copy ${label}`}
          className="shrink-0 px-3 rounded-xl bg-[#b08d57] hover:bg-[#c9a367] text-white transition-colors cursor-pointer shadow-xs"
        >
          {ok ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </motion.button>
      </div>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export default function PayInvoice({ order, token }: { order: Order | null; token: string }) {
  const [qr, setQr] = useState('');
  const [notified, setNotified] = useState<'whatsapp' | 'email' | null>(null);
  const inv = order?.invoice;

  const notifyReceipt = (method: 'whatsapp' | 'email') => {
    setNotified(method);
    fetch('/api/orders/receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, method }),
    }).catch(() => {
      /* the WhatsApp/email send itself already reached the business either way */
    });
  };

  useEffect(() => {
    if (!order || inv?.method !== 'crypto' || !inv.crypto) return;
    const payload = inv.crypto.asset === 'BTC' ? `bitcoin:${inv.crypto.address}?label=${encodeURIComponent(`Mini Highland Cows ${order.ref}`)}` : inv.crypto.address;
    QRCode.toDataURL(payload, { margin: 1, width: 200, color: { dark: '#1c3028', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [order, inv]);

  if (!order || !inv) {
    return (
      <main id="main" className="min-h-screen bg-[#fbf9f5] flex items-center justify-center px-4">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-serif font-bold text-[#232320]">This invoice link isn&rsquo;t valid</h1>
          <p className="text-sm text-[#705d48]">Open the link from your invoice email, or message the sales desk on WhatsApp and we&rsquo;ll resend it.</p>
        </motion.div>
      </main>
    );
  }

  const c = order.customer;
  const grand = order.totals.total;

  return (
    <main id="main" className="min-h-screen bg-gradient-to-b from-[#fdfbf6] to-[#fbf9f5]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-4 sm:space-y-5">
        {/* Header */}
        <motion.header
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#1c3028] via-[#25402f] to-[#1c3028] rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-lg"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#e5c07b]/10 blur-2xl" />
          <div className="absolute -bottom-14 -left-10 w-48 h-48 rounded-full bg-[#b08d57]/10 blur-2xl" />
          <span className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5c07b] text-[#1c3028] text-[11px] font-bold uppercase tracking-wider shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1c3028] animate-pulse" /> Tax invoice &middot; payment due
          </span>
          <h1 className="relative text-2xl sm:text-3xl font-serif font-bold break-words text-white">Invoice {order.ref}</h1>
          <p className="relative text-sm text-[#d7e0da]">Hi {c.name.split(' ')[0]} — your {order.animal.name} is reserved at Roma. Settle below and we book dispatch.</p>
        </motion.header>

        {/* Details + items */}
        <motion.section {...fadeUp} transition={{ duration: 0.5, delay: 0.05 }} className="bg-white rounded-3xl p-5 sm:p-8 space-y-5 shadow-sm border border-[#e5dec9]">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-[#a08a63] font-bold">Invoice to</dt><dd className="font-semibold text-[#232320]">{c.name}<br /><span className="font-normal text-[#705d48]">{c.email}</span></dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-[#a08a63] font-bold">Deliver to</dt><dd className="text-[#232320]">{c.postcode ? `${c.suburb ?? ''} ${c.state ?? ''} ${c.postcode}` : 'To be confirmed'}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-[#a08a63] font-bold">Supplier</dt><dd className="text-[#232320]">{SITE.companyName}<br />ABN {SITE.abn} &middot; Roma QLD 4455</dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-[#a08a63] font-bold">Issued</dt><dd className="text-[#232320]">{new Date(inv.issuedAt).toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'long' })}</dd></div>
          </dl>
          <div className="border-t border-[#f0ebd9]">
            <div className="py-4 border-b border-[#f0ebd9] flex justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#232320]">{order.animal.name}</div>
                <div className="text-xs text-[#a08a63]">{order.animal.earTag} &middot; {[order.animal.color, order.animal.sizeClass].filter(Boolean).join(' • ')}</div>
              </div>
              <div className="font-bold whitespace-nowrap shrink-0 text-right text-[#232320]">{aud(order.totals.price)}</div>
            </div>
          </div>
          <dl className="text-sm space-y-1.5">
            {order.totals.discount > 0 && <div className="flex justify-between text-[#1e7a46]"><dt>Crypto settlement incentive (10%)</dt><dd>&minus;{aud(order.totals.discount)}</dd></div>}
            <div className="flex justify-between text-[#705d48]"><dt>Includes GST (10%)</dt><dd>{aud(order.totals.gst)}</dd></div>
            <div className="flex justify-between text-[#705d48]"><dt>Freight</dt><dd>Confirmed once payment is received</dd></div>
            {order.totals.depositBalanceDue !== undefined && <div className="flex justify-between text-[#705d48]"><dt>Balance due before dispatch</dt><dd>{aud(order.totals.depositBalanceDue)}</dd></div>}
            <div className="flex justify-between text-lg font-bold text-[#1c3028] pt-3 border-t border-[#1c3028]/20"><dt>Amount payable</dt><dd>{aud(grand)}</dd></div>
          </dl>
        </motion.section>

        {/* Settlement box */}
        <motion.section {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="relative overflow-hidden bg-gradient-to-br from-[#fcf8ed] to-[#f5edd8] border-2 border-[#e5c07b] rounded-3xl p-5 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8a6a2e] font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Payment settlement
          </div>
          {inv.method === 'bank' && inv.bank && (
            <div className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-[#232320]">Bank transfer &middot; PayID / EFT</h2>
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
              <h2 className="text-lg font-serif font-bold text-[#232320]">{inv.crypto.asset} &middot; {inv.crypto.network}</h2>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt={`QR code for the ${inv.crypto.asset} address`} width={160} height={160} className="rounded-xl border border-[#e5dec9] bg-white shrink-0 shadow-xs mx-auto sm:mx-0" />
                ) : (
                  <div className="w-40 h-40 rounded-xl border border-[#e5dec9] bg-white mx-auto sm:mx-0" />
                )}
                <div className="flex-1 min-w-0 space-y-3">
                  <CopyField label={`${inv.crypto.asset} address`} value={inv.crypto.address} />
                  <p className="text-xs text-[#705d48] leading-relaxed">Send the {inv.crypto.asset} equivalent of <strong className="text-[#232320]">{aud(order.totals.total)}</strong> at the rate your wallet shows when you send. Check the network first — a transfer on the wrong network cannot be recovered. Only ever use an address shown on this site.</p>
                </div>
              </div>
            </div>
          )}
          {inv.notes && <p className="text-xs text-[#4b4337] border-t border-[#e5c07b]/40 pt-3 leading-relaxed">{inv.notes}</p>}
        </motion.section>

        {/* Confirm payment: two choices */}
        <motion.section {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="bg-white rounded-3xl p-5 sm:p-8 space-y-4 shadow-sm border border-[#e5dec9]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#232320]">Confirm Payment &amp; Get Tracking</h2>
            <p className="text-xs text-[#705d48] mt-1">Send your receipt or a screenshot below — once we confirm it, we mark your order paid and organise dispatch tracking.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.a
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2 }}
              href={whatsappReceiptUrl(order)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => notifyReceipt('whatsapp')}
              className="inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1e7a46] hover:bg-[#25984f] text-white font-bold text-sm transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Receipt
            </motion.a>
            <motion.a
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2 }}
              href={mailtoReceiptUrl(order)}
              onClick={() => notifyReceipt('email')}
              className="inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1c3028] hover:bg-[#284439] text-[#e5c07b] font-bold text-sm transition-colors shadow-md"
            >
              <Mail className="w-4 h-4" /> Email Receipt
            </motion.a>
          </div>
          {notified && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1e7a46] bg-[#e4f4ea] border border-[#7fd0a0] rounded-xl px-3 py-2"
            >
              <Check className="w-3.5 h-3.5" /> We&rsquo;ve emailed you a confirmation that your payment notice was received — we&rsquo;ll verify and follow up shortly.
            </motion.p>
          )}
          <p className="text-[11px] text-[#a08a63] text-center">Questions? <a href={`mailto:${CONTACT.email}`} className="text-[#8a6a2e] hover:underline font-semibold">{CONTACT.email}</a></p>
        </motion.section>

        <motion.footer {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="text-center text-[11px] text-[#a08a63] space-y-1 pb-4">
          <p className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#b08d57]" /> {SITE.companyName} &middot; ABN {SITE.abn} &middot; Roma QLD 4455</p>
          <p>All prices include 10% GST. <Link href="/faq" className="underline hover:text-[#8a6a2e]">FAQ</Link> &middot; <Link href="/contact" className="underline hover:text-[#8a6a2e]">Contact</Link></p>
        </motion.footer>
      </div>
    </main>
  );
}
