'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { Landmark, Bitcoin, Send, Lock, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { type Order, type InvoiceDetails, aud, paymentLabel } from '@/lib/orders-shared';
import { CRYPTO } from '@/lib/site-config';

type Method = 'bank' | 'crypto';

interface Props {
  token: string;
  order: Order;
  bankDefaults: { accountName: string; bsb: string; accountNumber: string; payId: string };
}

const hasCrypto = CRYPTO.wallets.length > 0;

const input =
  'w-full px-3 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#e5dec9] text-[#232320] text-sm placeholder-[#a08a63] focus:outline-none focus:border-[#b08d57] transition-colors';
const label = 'block text-[11px] uppercase tracking-[0.15em] text-[#8a6a2e] font-bold mb-1.5';
const card = 'bg-white border border-[#e5dec9] rounded-3xl p-5 space-y-3 shadow-sm';

export default function SettleTerminal({ token, order, bankDefaults }: Props) {
  const defaultMethod: Method = order.payment === 'crypto' && hasCrypto ? 'crypto' : 'bank';
  const [method, setMethod] = useState<Method>(defaultMethod);
  const [bank, setBank] = useState(bankDefaults);
  const [walletKey, setWalletKey] = useState(CRYPTO.wallets[0]?.key ?? '');
  const [notes, setNotes] = useState('');
  const [qr, setQr] = useState('');
  const [preview, setPreview] = useState('');
  const [incomplete, setIncomplete] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ payUrl: string; adminUrl: string; success: boolean; error?: string } | null>(null);

  const wallet = useMemo(() => CRYPTO.wallets.find((w) => w.key === walletKey) ?? CRYPTO.wallets[0], [walletKey]);

  const invoice = useMemo<Partial<InvoiceDetails>>(
    () => ({
      method,
      bank: method === 'bank' ? bank : undefined,
      crypto: method === 'crypto' && wallet ? { walletKey: wallet.key, asset: wallet.asset, network: wallet.network, address: wallet.address } : undefined,
      notes,
    }),
    [method, bank, wallet, notes]
  );

  useEffect(() => {
    if (method !== 'crypto' || !wallet) return;
    const payload = wallet.asset === 'BTC' ? `bitcoin:${wallet.address}?label=${encodeURIComponent(`Mini Highland Cows ${order.ref}`)}` : wallet.address;
    QRCode.toDataURL(payload, { margin: 1, width: 160, color: { dark: '#1c3028', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [method, wallet, order.ref]);

  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/invoice?preview=1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, invoice }),
        });
        const data = await res.json();
        if (data.html) setPreview(data.html);
        setIncomplete(data.incomplete || '');
      } catch {
        /* keep the last preview */
      }
    }, 350);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [token, invoice]);

  const dispatch = async () => {
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/admin/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, invoice }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Send failed');
      setSent(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Form column first on mobile (the primary task); preview follows below */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="xl:col-span-2 space-y-5 order-1">
        <section className={card}>
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a2e] font-bold">Order (locked)</h2>
            <Lock className="w-3.5 h-3.5 text-[#a08a63]" />
          </div>
          <dl className="text-sm space-y-1.5">
            <div className="flex justify-between gap-3"><dt className="text-[#a08a63]">Customer</dt><dd className="font-semibold text-right text-[#232320]">{order.customer.name}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#a08a63]">Email</dt><dd className="text-right break-all text-[#232320]">{order.customer.email}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#a08a63]">Phone</dt><dd className="text-right text-[#232320]">{order.customer.phone ?? '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#a08a63]">Chosen on site</dt><dd className="text-right text-[#232320]">{paymentLabel(order.payment)}</dd></div>
          </dl>
          <ul className="border-t border-[#f0ebd9] pt-3 space-y-1.5 text-sm">
            <li className="flex justify-between gap-3">
              <span className="text-[#232320]">{order.animal.name} <span className="text-[#a08a63]">({order.animal.earTag})</span></span>
              <span className="whitespace-nowrap text-[#232320]">{aud(order.totals.price)}</span>
            </li>
            <li className="flex justify-between gap-3 pt-2 border-t border-[#f0ebd9] font-bold text-[#8a6a2e]">
              <span>{order.totals.depositBalanceDue !== undefined ? 'Deposit payable now' : 'Total'}</span>
              <span>{aud(order.totals.total)}</span>
            </li>
          </ul>
        </section>

        <section className={card}>
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a2e] font-bold">Payment coordinates</h2>
          <div className={`grid ${hasCrypto ? 'grid-cols-2' : 'grid-cols-1'} gap-2`} role="radiogroup" aria-label="Payment method">
            <button
              type="button"
              role="radio"
              aria-checked={method === 'bank'}
              onClick={() => setMethod('bank')}
              className={`rounded-xl border p-2.5 text-left transition-all hover:-translate-y-px ${method === 'bank' ? 'border-[#b08d57] bg-[#fcf8ed] shadow-[0_0_0_3px_rgba(176,141,87,0.16)]' : 'border-[#e5dec9] hover:border-[#cbb98f]'}`}
            >
              <Landmark className={`w-4 h-4 mb-1 ${method === 'bank' ? 'text-[#8a6a2e]' : 'text-[#a08a63]'}`} />
              <div className="text-xs font-bold leading-tight text-[#232320]">Bank / PayID</div>
              <div className="text-[10px] text-[#a08a63] leading-tight">BSB, account, reference</div>
            </button>
            {hasCrypto && (
              <button
                type="button"
                role="radio"
                aria-checked={method === 'crypto'}
                onClick={() => setMethod('crypto')}
                className={`rounded-xl border p-2.5 text-left transition-all hover:-translate-y-px ${method === 'crypto' ? 'border-[#b08d57] bg-[#fcf8ed] shadow-[0_0_0_3px_rgba(176,141,87,0.16)]' : 'border-[#e5dec9] hover:border-[#cbb98f]'}`}
              >
                <Bitcoin className={`w-4 h-4 mb-1 ${method === 'crypto' ? 'text-[#8a6a2e]' : 'text-[#a08a63]'}`} />
                <div className="text-xs font-bold leading-tight text-[#232320]">Crypto</div>
                <div className="text-[10px] text-[#a08a63] leading-tight">BTC &middot; USDT, QR code</div>
              </button>
            )}
          </div>

          {method === 'bank' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="acct-name">Account name</label>
                <input id="acct-name" className={input} value={bank.accountName} onChange={(e) => setBank({ ...bank, accountName: e.target.value })} placeholder="MHC Pty Ltd" />
              </div>
              <div>
                <label className={label} htmlFor="bsb">BSB</label>
                <input id="bsb" className={input} inputMode="numeric" value={bank.bsb} onChange={(e) => setBank({ ...bank, bsb: e.target.value })} placeholder="000-000" />
              </div>
              <div>
                <label className={label} htmlFor="acct-no">Account number</label>
                <input id="acct-no" className={input} inputMode="numeric" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} placeholder="12345678" />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="payid">PayID <span className="normal-case tracking-normal font-normal text-[#a08a63]">(optional)</span></label>
                <input id="payid" className={input} value={bank.payId} onChange={(e) => setBank({ ...bank, payId: e.target.value })} placeholder="e.g. an email or ABN registered for PayID" />
              </div>
              <p className="sm:col-span-2 text-[11px] text-[#a08a63]">Reference is fixed to <span className="font-mono text-[#232320]">{order.ref}</span>. Set BANK_* env vars on Vercel to pre-load these fields.</p>
            </div>
          )}

          {method === 'crypto' && wallet && (
            <div className="space-y-3">
              {order.payment !== 'crypto' && (
                <p className="flex items-start gap-2 text-[11px] text-[#a13d2b] bg-[#fbeae5] border border-[#e5b7a4] rounded-xl px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                  This order was priced without the 10% crypto discount. Ask the buyer to reorder with Crypto selected, or invoice by bank.
                </p>
              )}
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Wallet">
                {CRYPTO.wallets.map((w) => (
                  <button key={w.key} type="button" role="radio" aria-checked={w.key === walletKey} onClick={() => setWalletKey(w.key)} className={`rounded-xl border p-2 text-left transition-colors ${w.key === walletKey ? 'border-[#b08d57] bg-[#fcf8ed]' : 'border-[#e5dec9] hover:border-[#cbb98f]'}`}>
                    <div className="text-xs font-bold text-[#232320]">{w.asset}</div>
                    <div className="text-[10px] text-[#a08a63]">{w.network}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 items-start">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt={`QR for ${wallet.asset} address`} width={112} height={112} className="rounded-xl border border-[#e5dec9] bg-white shrink-0" />
                ) : (
                  <div className="w-28 h-28 rounded-xl border border-[#e5dec9]" />
                )}
                <code className="text-[11px] font-mono break-all text-[#232320] bg-[#fbf9f5] border border-[#e5dec9] rounded-xl p-2.5 flex-1">{wallet.address}</code>
              </div>
              <p className="text-[11px] text-[#a08a63]">Addresses come from the site config only; nothing typed here can change them.</p>
            </div>
          )}
        </section>

        <section className={card}>
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a2e] font-bold">Invoice notes</h2>
          <div>
            <label className={label} htmlFor="notes">Notes on the invoice <span className="normal-case tracking-normal font-normal text-[#a08a63]">(optional)</span></label>
            <textarea id="notes" className={`${input} min-h-[72px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Freight is quoted once payment clears — mention that here if useful." />
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#fcf8ed] to-[#f5edd8] border-2 border-[#e5c07b] rounded-3xl p-5 space-y-3 shadow-sm">
          {incomplete && !sent && (
            <p className="flex items-start gap-2 text-[11px] text-[#8a6a2e]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
              {incomplete}
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-[#a13d2b] bg-[#fbeae5] border border-[#e5b7a4] rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          {!sent ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={dispatch}
              disabled={sending || Boolean(incomplete)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#b08d57] hover:bg-[#c9a367] text-white font-bold text-sm transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              Send Official HTML Invoice to {order.customer.email}
            </motion.button>
          ) : (
            <div className="space-y-3">
              <p className="flex items-start gap-2 text-sm text-[#1e7a46]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                Invoice emailed to {order.customer.email} (copy to the sales desk).
              </p>
              <a href={sent.payUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#cbb98f] hover:border-[#b08d57] text-[#232320] text-sm font-semibold transition-colors bg-white">
                <ExternalLink className="w-4 h-4" />
                Open client invoice
              </a>
              <p className="text-[11px] text-[#a08a63]">Status is now <strong className="text-[#232320]">Invoice Sent</strong>. <a href={sent.adminUrl} className="underline hover:text-[#8a6a2e]">Updated order card</a>.</p>
            </div>
          )}
        </section>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="xl:col-span-3 order-2 bg-white border border-[#e5dec9] rounded-3xl p-3 sm:p-4 flex flex-col min-h-[420px] xl:min-h-[560px] shadow-sm"
      >
        <div className="flex items-center justify-between px-1 pb-3">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a2e] font-bold">Live preview — what the client receives</h2>
          <span className="text-[10px] text-[#a08a63]">updates as you type</span>
        </div>
        <iframe title="Invoice preview" srcDoc={preview} className="flex-1 w-full rounded-xl bg-[#fbf9f5] border border-[#e5dec9] min-h-[380px] xl:min-h-[520px]" sandbox="" />
      </motion.section>
    </div>
  );
}
