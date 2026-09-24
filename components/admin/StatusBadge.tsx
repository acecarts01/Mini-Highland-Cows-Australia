import React from 'react';
import { STATUS_LABEL, type OrderStatus } from '@/lib/orders-shared';

const TONE: Record<OrderStatus, string> = {
  new: 'bg-[#b08d57] text-white border-[#b08d57]',
  invoice_sent: 'bg-[#fcf8ed] text-[#8a6a2e] border-[#e5c07b]',
  paid: 'bg-[#e4f4ea] text-[#1e7a46] border-[#7fd0a0]',
  dispatched: 'bg-[#e4f4ea] text-[#1e7a46] border-[#7fd0a0]',
};

export default function StatusBadge({ status, active = true, done = false }: { status: OrderStatus; active?: boolean; done?: boolean }) {
  const tone = active ? TONE[status] : done ? 'bg-[#e4f4ea]/60 text-[#1e7a46] border-[#7fd0a0]/60' : 'bg-transparent text-[#a08a63] border-[#e5dec9]';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all ${tone} ${active ? 'shadow-[0_0_0_4px_rgba(176,141,87,0.14)]' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-current animate-pulse' : 'bg-current opacity-60'}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
