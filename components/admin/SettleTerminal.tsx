'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
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
  'w-full px-3 py-2.5 rounded-lg bg-[#0f1a15] border border-white/15 text-white text-sm placeholder-[#5c6b5d] focus:outline-none focus:border-[#b08d57] transition-colors';
const label = 'block text-[11px] uppercase tracking-[0.15em] text-[#e5c07b] font-bold mb-1.5';

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
      <div className="xl:col-span-2 space-y-5">
        <section className="bg-[#1c3028] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#e5c07b] font-bold">Order (locked)</h2>
            <Lock className="w-3.5 h-3.5 text-[#a9b4a2]" />
          </div>
          <dl className="text-sm space-y-1.5">
            <div className="flex justify-between gap-3"><dt className="text-[#a9b4a2]">Customer</dt><dd className="font-semibold text-right">{order.customer.name}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#a9b4a2]">Email</dt><dd className="text-right break-all">{order.customer.email}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#a9b4a2]">Phone</dt><dd className="text-right">{order.customer.phone ?? '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#a9b4a2]">Chosen on site</dt><dd className="text-right">{paymentLabel(order.payment)}</dd></div>
          </dl>
          <ul className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
            <li className="flex justify-between gap-3">
              <span className="text-[#e7ecdf]">{order.animal.name} <span className="text-[#a9b4a2]">({order.animal.earTag})</span></span>
              <span className="whitespace-nowrap">{aud(order.totals.price)}</span>
            </li>
            <li className="flex justify-between gap-3 pt-2 border-t border-white/10 font-bold text-[#e5c07b]">
              <span>{order.totals.depositBalanceDue !== undefined ? 'Deposit payable now' : 'Total'}</span>
              <span>{aud(order.totals.total)}</span>
            </li>
          </ul>
        </section>

        <section className="bg-[#1c3028] border border-white/10 rounded-2xl p-5 space-y-4">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#e5c07b] font-bold">Payment coordinates</h2>
          <div className={`grid ${hasCrypto ? 'grid-cols-2' : 'grid-cols-1'} gap-2`} role="radiogroup" aria-label="Payment method">
            <button
              type="button"
              role="radio"
              aria-checked={method === 'bank'}
              onClick={() => setMethod('bank')}
              className={`rounded-lg border p-2.5 text-left transition-all hover:-translate-y-px ${method === 'bank' ? 'border-[#b08d57] bg-[#152420] shadow-[0_0_0_3px_rgba(176,141,87,0.18)]' : 'border-white/15 hover:border-white/40'}`}
            >
              <Landmark className={`w-4 h-4 mb-1 ${method === 'bank' ? 'text-[#e5c07b]' : 'text-[#a9b4a2]'}`} />
              <div className="text-xs font-bold leading-tight">Bank / PayID</div>
              <div className="text-[10px] text-[#a9b4a2] leading-tight">BSB, account, reference</div>
            </button>
            {hasCrypto && (
              <button
                type="button"
                role="radio"
                aria-checked={method === 'crypto'}
                onClick={() => setMethod('crypto')}
                className={`rounded-lg border p-2.5 text-left transition-all hover:-translate-y-px ${method === 'crypto' ? 'border-[#b08d57] bg-[#152420] shadow-[0_0_0_3px_rgba(176,141,87,0.18)]' : 'border-white/15 hover:border-white/40'}`}
              >
                <Bitcoin className={`w-4 h-4 mb-1 ${method === 'crypto' ? 'text-[#e5c07b]' : 'text-[#a9b4a2]'}`} />
                <div className="text-xs font-bold leading-tight">Crypto</div>
                <div className="text-[10px] text-[#a9b4a2] leading-tight">BTC &middot; USDT, QR code</div>
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
                <label className={label} htmlFor="payid">PayID <span className="normal-case tracking-normal font-normal text-[#a9b4a2]">(optional)</span></label>
                <input id="payid" className={input} value={bank.payId} onChange={(e) => setBank({ ...bank, payId: e.target.value })} placeholder="e.g. an email or ABN registered for PayID" />
              </div>
              <p className="sm:col-span-2 text-[11px] text-[#a9b4a2]">Reference is fixed to <span className="font-mono text-white">{order.ref}</span>. Set BANK_* env vars on Vercel to pre-load these fields.</p>
            </div>
          )}

          {method === 'crypto' && wallet && (
            <div className="space-y-3">
              {order.payment !== 'crypto' && (
                <p className="flex items-start gap-2 text-[11px] text-[#f3c6b0] bg-[#3a1c14] border border-[#7a3a28] rounded-lg px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                  This order was priced without the 10% crypto discount. Ask the buyer to reorder with Crypto selected, or invoice by bank.
                </p>
              )}
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Wallet">
                {CRYPTO.wallets.map((w) => (
                  <button key={w.key} type="button" role="radio" aria-checked={w.key === walletKey} onClick={() => setWalletKey(w.key)} className={`rounded-lg border p-2 text-left transition-colors ${w.key === walletKey ? 'border-[#b08d57] bg-[#152420]' : 'border-white/15 hover:border-white/40'}`}>
                    <div className="text-xs font-bold">{w.asset}</div>
                    <div className="text-[10px] text-[#a9b4a2]">{w.network}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 items-start">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt={`QR for ${wallet.asset} address`} width={112} height={112} className="rounded-lg border border-white/15 bg-white shrink-0" />
                ) : (
                  <div className="w-28 h-28 rounded-lg border border-white/15" />
                )}
                <code className="text-[11px] font-mono break-all text-[#e7ecdf] bg-[#0f1a15] border border-white/15 rounded-lg p-2.5 flex-1">{wallet.address}</code>
              </div>
              <p className="text-[11px] text-[#a9b4a2]">Addresses come from the site config only; nothing typed here can change them.</p>
            </div>
          )}
        </section>

        <section className="bg-[#1c3028] border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#e5c07b] font-bold">Invoice notes</h2>
          <div>
            <label className={label} htmlFor="notes">Notes on the invoice <span className="normal-case tracking-normal font-normal text-[#a9b4a2]">(optional)</span></label>
            <textarea id="notes" className={`${input} min-h-[72px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Freight is quoted once payment clears — mention that here if useful." />
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#1c3028] to-[#152420] border border-[#b08d57]/50 rounded-2xl p-5 space-y-3">
          {incomplete && !sent && (
            <p className="flex items-start gap-2 text-[11px] text-[#e5c07b]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
              {incomplete}
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-[#f3c6b0] bg-[#3a1c14] border border-[#7a3a28] rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {!sent ? (
            <button
              type="button"
              onClick={dispatch}
              disabled={sending || Boolean(incomplete)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#b08d57] hover:bg-[#c9a367] text-[#1c3028] font-bold text-sm transition-all hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send Official HTML Invoice to {order.customer.email}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="flex items-start gap-2 text-sm text-[#7fd0a0]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                Invoice emailed to {order.customer.email} (copy to the sales desk).
              </p>
              <a href={sent.payUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/20 hover:border-[#b08d57] text-sm font-semibold transition-colors">
                <ExternalLink className="w-4 h-4" />
                Open client invoice
              </a>
              <p className="text-[11px] text-[#a9b4a2]">Status is now <strong className="text-white">Invoice Sent</strong>. <a href={sent.adminUrl} className="underline hover:text-[#e5c07b]">Updated order card</a>.</p>
            </div>
          )}
        </section>
      </div>

      <section className="xl:col-span-3 bg-[#1c3028] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col min-h-[560px]">
        <div className="flex items-center justify-between px-1 pb-3">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#e5c07b] font-bold">Live preview — what the client receives</h2>
          <span className="text-[10px] text-[#a9b4a2]">updates as you type</span>
        </div>
        <iframe title="Invoice preview" srcDoc={preview} className="flex-1 w-full rounded-xl bg-[#0f1a15] border border-white/10 min-h-[520px]" sandbox="" />
      </section>
    </div>
  );
}
