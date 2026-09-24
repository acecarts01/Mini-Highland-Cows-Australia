import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Mail, Phone, MapPin, CreditCard, ArrowRight, Inbox } from 'lucide-react';
import { isAdminRequest } from '@/lib/admin-auth';
import { verifyOrder, aud, paymentLabel, STATUS_LABEL, type OrderStatus } from '@/lib/orders';
import { getOrder, getOrderEvents } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import StatusBadge from '@/components/admin/StatusBadge';
import OrderStatusActions from '@/components/admin/OrderStatusActions';

// /admin/orders?o=<token> - the order card. Without a token it explains
// where orders arrive: every new order emails the sales desk a signed link.
export default async function AdminOrderPage({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  if (!(await isAdminRequest())) redirect(`/admin/login?next=${encodeURIComponent(`/admin/orders${o ? `?o=${o}` : ''}`)}`);

  const order = verifyOrder(o);

  if (!order) {
    return (
      <AdminShell title="Orders" subtitle="Open an order from the link in its sales-desk email.">
        <div className="bg-[#1c3028] border border-white/10 rounded-2xl p-8 text-center space-y-3">
          <Inbox className="w-8 h-8 mx-auto text-[#e5c07b]" />
          <p className="text-sm text-[#a9b4a2] max-w-md mx-auto">
            {o ? 'That order link is invalid or was signed with a different secret.' : 'Every new order emails the sales desk a signed link. Tap "View Order in Admin" in that email to land here with the order loaded.'}
          </p>
          <Link href="/admin/portal" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e5c07b] hover:underline">
            Go to the portal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </AdminShell>
    );
  }

  // The database is the live source of truth for status once it advances
  // past what the token was signed with (paid, dispatched).
  const dbRow = await getOrder(order.ref).catch(() => null);
  if (dbRow) order.status = dbRow.status;

  const c = order.customer;
  const settle = `/admin/orders/settle?o=${encodeURIComponent(o!)}`;
  const steps: OrderStatus[] = ['new', 'invoice_sent', 'paid', 'dispatched'];
  const current = steps.indexOf(order.status);
  const events = await getOrderEvents(order.ref).catch(() => []);

  return (
    <AdminShell title={`Order ${order.ref}`} subtitle={`Placed ${new Date(order.createdAt).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' })} AEST`}>
      <ol className="flex flex-wrap gap-2 mb-6">
        {steps.map((s, i) => (
          <li key={s}>
            <StatusBadge status={s} active={i === current} done={i < current} />
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <section className="lg:col-span-2 bg-[#1c3028] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-[#b08d57]/50 transition-colors">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#e5c07b] font-bold">Customer</h2>
          <div className="text-lg font-serif font-bold">{c.name}</div>
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#a9b4a2] mt-0.5 shrink-0" />
              <a href={`mailto:${c.email}`} className="hover:text-[#e5c07b] break-all">{c.email}</a>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#a9b4a2] mt-0.5 shrink-0" />
              {c.phone ? <a href={`tel:${c.phone}`} className="hover:text-[#e5c07b]">{c.phone}</a> : <span className="text-[#a9b4a2]">No phone given</span>}
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#a9b4a2] mt-0.5 shrink-0" />
              <span>{c.postcode ? `${c.address ?? ''}${c.suburb ? `, ${c.suburb}` : ''} ${c.state ?? ''} ${c.postcode}` : <span className="text-[#a9b4a2]">Address not given</span>}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-[#a9b4a2] mt-0.5 shrink-0" />
              <span>{paymentLabel(order.payment)}</span>
            </div>
          </dl>
          {(c.picNumber || c.needPicHelp) && (
            <div className="pt-2 border-t border-white/10 text-xs text-[#a9b4a2]">
              PIC: {c.needPicHelp ? 'Assistance needed' : c.picNumber}
            </div>
          )}
        </section>

        <section className="lg:col-span-3 bg-[#1c3028] border border-white/10 rounded-2xl p-6 hover:border-[#b08d57]/50 transition-colors">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#e5c07b] font-bold mb-4">Animal</h2>
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="font-semibold leading-snug">{order.animal.name}</div>
              <div className="text-xs text-[#a9b4a2] mt-0.5">{order.animal.earTag} &middot; {[order.animal.color, order.animal.sizeClass].filter(Boolean).join(' • ')}</div>
            </div>
            <div className="font-bold whitespace-nowrap shrink-0">{aud(order.totals.price)}</div>
          </div>
          <dl className="mt-4 space-y-1.5 text-sm">
            {order.totals.discount > 0 && <div className="flex justify-between text-[#7fd0a0]"><dt>Crypto incentive 10%</dt><dd>&minus;{aud(order.totals.discount)}</dd></div>}
            <div className="flex justify-between text-[#a9b4a2]"><dt>Includes GST</dt><dd>{aud(order.totals.gst)}</dd></div>
            {order.totals.depositBalanceDue !== undefined && <div className="flex justify-between text-[#a9b4a2]"><dt>Balance due before dispatch</dt><dd>{aud(order.totals.depositBalanceDue)}</dd></div>}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10 text-[#e5c07b]"><dt>{order.totals.depositBalanceDue !== undefined ? 'Deposit payable now' : 'Total'}</dt><dd>{aud(order.totals.total)}</dd></div>
          </dl>
        </section>
      </div>

      <div className="mt-6 bg-gradient-to-r from-[#1c3028] to-[#152420] border border-[#b08d57]/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-serif font-bold text-lg">{order.status === 'new' ? 'Ready to invoice' : 'Invoice already sent'}</div>
          <p className="text-sm text-[#a9b4a2]">The settlement terminal opens with every field from this order already filled.</p>
        </div>
        <Link href={settle} className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#b08d57] hover:bg-[#c9a367] text-[#1c3028] font-bold text-sm transition-all hover:-translate-y-px shadow-lg shadow-black/30">
          Go to settlement terminal
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-[#a9b4a2]">Status: {STATUS_LABEL[order.status]}.</p>
        <OrderStatusActions orderRef={order.ref} status={order.status} />
      </div>

      {events.length > 0 && (
        <section className="mt-6 bg-[#1c3028] border border-white/10 rounded-2xl p-6">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#e5c07b] font-bold mb-4">Activity</h2>
          <ol className="space-y-3">
            {events.map((e, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b08d57] mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold">{STATUS_LABEL[e.status as OrderStatus] ?? e.status}</span>
                  {e.note ? <span className="text-[#a9b4a2]"> — {e.note}</span> : null}
                  <div className="text-[11px] text-[#a9b4a2]">{new Date(e.at).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' })} AEST</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </AdminShell>
  );
}
