'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Truck } from 'lucide-react';
import type { OrderStatus } from '@/lib/orders-shared';

export default function OrderStatusActions({ orderRef, status }: { orderRef: string; status: OrderStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');

  const mark = async (next: OrderStatus) => {
    setBusy(next);
    setError('');
    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: orderRef, status: next }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to update status');
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  if (status === 'paid' || status === 'dispatched') return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === 'invoice_sent' && (
        <button type="button" onClick={() => mark('paid')} disabled={busy !== null} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e7a46] hover:bg-[#25984f] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {busy === 'paid' ? 'Marking…' : 'Mark paid'}
        </button>
      )}
      <button type="button" onClick={() => mark('dispatched')} disabled={busy !== null} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e5dec9] hover:border-[#b08d57] text-[#232320] text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer">
        <Truck className="w-3.5 h-3.5" />
        {busy === 'dispatched' ? 'Marking…' : 'Mark dispatched'}
      </button>
      {error && <span className="text-[11px] text-[#a13d2b]">{error}</span>}
    </div>
  );
}
