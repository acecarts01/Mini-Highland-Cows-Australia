'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
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
    <main id="main" className="min-h-screen bg-gradient-to-b from-[#fdfbf6] to-[#fbf9f5] flex items-center justify-center px-4 py-10">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={submit}
        className="w-full max-w-sm bg-white border border-[#e5dec9] rounded-3xl p-7 shadow-lg space-y-5"
      >
        <div className="text-center space-y-2">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-12 h-12 rounded-full bg-[#b08d57] text-white font-serif font-bold flex items-center justify-center mx-auto text-lg shadow-md"
          >
            MH
          </motion.span>
          <h1 className="text-xl font-serif font-bold text-[#232320]">Sales desk admin</h1>
          <p className="text-xs text-[#705d48]">Enter the admin passphrase to open orders and send invoices.</p>
        </div>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.15em] text-[#8a6a2e] font-bold mb-1.5">Passphrase</span>
          <span className="relative block">
            <KeyRound className="w-4 h-4 text-[#a08a63] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#e5dec9] text-[#232320] text-sm focus:outline-none focus:border-[#b08d57] transition-colors"
            />
          </span>
        </label>
        {error && (
          <p role="alert" className="text-xs text-[#a13d2b] bg-[#fbeae5] border border-[#e5b7a4] rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#b08d57] hover:bg-[#c9a367] text-white font-bold text-sm transition-colors disabled:opacity-60 cursor-pointer shadow-md"
        >
          {busy ? 'Checking…' : 'Open admin'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.form>
    </main>
  );
}
