import React from 'react';
import { STATUS_LABEL, type OrderStatus } from '@/lib/orders';

const TONE: Record<OrderStatus, string> = {
  new: 'bg-[#b08d57] text-[#1c3028] border-[#b08d57]',
  invoice_sent: 'bg-[#1c3028] text-white border-[#4c6a58]',
  paid: 'bg-[#0f3d26] text-[#7fd0a0] border-[#1e7a46]',
  dispatched: 'bg-[#0f3d26] text-[#7fd0a0] border-[#1e7a46]',
};

export default function StatusBadge({ status, active = true, done = false }: { status: OrderStatus; active?: boolean; done?: boolean }) {
  const tone = active ? TONE[status] : done ? 'bg-[#0f3d26]/60 text-[#7fd0a0] border-[#1e7a46]/60' : 'bg-transparent text-[#6b7a6f] border-white/10';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all ${tone} ${active ? 'shadow-[0_0_0_4px_rgba(176,141,87,0.18)]' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-current animate-pulse' : 'bg-current opacity-60'}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
