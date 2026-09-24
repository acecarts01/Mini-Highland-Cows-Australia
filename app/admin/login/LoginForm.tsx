'use client';

import React, { useState } from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';

export default function LoginForm({ next }: { next: string }) {
  const [passphrase, setPassphrase] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase }),
    });
    if (res.ok) {
      window.location.href = next;
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.message || 'Sign-in failed.');
    setBusy(false);
  };

  return (
    <main id="main" className="min-h-screen bg-[#0f1a15] text-white flex items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm bg-[#1c3028] border border-white/10 rounded-2xl p-7 shadow-2xl space-y-5">
        <div className="text-center space-y-2">
          <span className="w-12 h-12 rounded-full bg-[#b08d57] text-[#1c3028] font-serif font-bold flex items-center justify-center mx-auto text-lg">MH</span>
          <h1 className="text-xl font-serif font-bold">Sales desk admin</h1>
          <p className="text-xs text-[#a9b4a2]">Enter the admin passphrase to open orders and send invoices.</p>
        </div>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.15em] text-[#e5c07b] font-bold mb-1.5">Passphrase</span>
          <span className="relative block">
            <KeyRound className="w-4 h-4 text-[#a9b4a2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0f1a15] border border-white/15 text-white text-sm focus:outline-none focus:border-[#b08d57] transition-colors"
            />
          </span>
        </label>
        {error && (
          <p role="alert" className="text-xs text-[#f3c6b0] bg-[#3a1c14] border border-[#7a3a28] rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#b08d57] hover:bg-[#c9a367] text-[#1c3028] font-bold text-sm transition-colors disabled:opacity-60 cursor-pointer"
        >
          {busy ? 'Checking…' : 'Open admin'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
}
