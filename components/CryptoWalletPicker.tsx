'use client';

import React, { useEffect, useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';
import { CRYPTO, CONTACT } from '@/lib/site-config';

const OTHER_COIN_MESSAGE = encodeURIComponent(
  "Hi Mini Highland Cows, I'd like to pay in crypto but the coin or network I use isn't listed. Can you give me an address for: "
);

export default function CryptoWalletPicker() {
  const wallets = CRYPTO.wallets;
  const [selectedKey, setSelectedKey] = useState(wallets[0]?.key ?? '');
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);

  const wallet = wallets.find((w) => w.key === selectedKey) ?? wallets[0];

  useEffect(() => {
    if (!wallet) return;
    let cancelled = false;
    setQr('');
    setCopied(false);
    const payload = wallet.asset === 'BTC' ? `bitcoin:${wallet.address}` : wallet.address;
    import('qrcode')
      .then((mod) =>
        (mod.default ?? mod).toDataURL(payload, { margin: 1, width: 240, color: { dark: '#1c3028', light: '#ffffff' } })
      )
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => {
        if (!cancelled) setQr('');
      });
    return () => {
      cancelled = true;
    };
  }, [wallet]);

  if (!wallet) return null;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-4" data-testid="crypto-wallet-picker">
      <div>
        <h6 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Choose your coin and network</h6>
        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
          Pick the coin you will pay with. After you place your order we send an invoice confirming the AUD amount, then you
          send the equivalent from your wallet to the address below (scan the QR or copy it).
        </p>
      </div>

      <div role="radiogroup" aria-label="Crypto coin and network" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {wallets.map((w) => {
          const active = w.key === wallet.key;
          return (
            <button
              key={w.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedKey(w.key)}
              className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                active
                  ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/30'
                  : 'border-gray-200 bg-white/70 hover:border-emerald-300'
              }`}
            >
              <span className="block text-xs font-bold text-[#232320]">{w.asset}</span>
              <span className="block text-[10px] text-gray-500 leading-tight">{w.network}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start" aria-live="polite">
        <div className="shrink-0">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr}
              alt={`QR code for the ${wallet.asset} (${wallet.network}) address`}
              width={160}
              height={160}
              className="rounded-xl border border-[#e5dec9] bg-white shadow-xs"
            />
          ) : (
            <div className="w-[160px] h-[160px] rounded-xl border border-[#e5dec9] bg-white animate-pulse" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 w-full space-y-2">
          <p className="text-xs font-bold text-emerald-900">
            {wallet.asset} &middot; {wallet.network}
          </p>
          <div className="flex items-stretch gap-2">
            <code className="flex-1 min-w-0 break-all rounded-lg border border-[#e5dec9] bg-white px-3 py-2 text-[11px] text-[#232320]">
              {wallet.address}
            </code>
            <button
              type="button"
              onClick={copyAddress}
              className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-emerald-600 bg-white px-3 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Check the network matches before sending: a transfer on the wrong network cannot be recovered. Only ever use an
            address shown on this site.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-emerald-200 pt-3">
        <p className="text-[11px] text-gray-600">
          <strong className="text-[#232320]">Your coin isn&rsquo;t listed?</strong> Tell us which coin and network you prefer and we
          will provide an address for it.
        </p>
        <a
          href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=${OTHER_COIN_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
