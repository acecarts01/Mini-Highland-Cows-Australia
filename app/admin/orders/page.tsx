import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Mail, Phone, MapPin, CreditCard, ArrowRight, Inbox } from 'lucide-react';
import { isAdminRequest } from '@/lib/admin-auth';
import { verifyOrder, STATUS_LABEL } from '@/lib/orders';
import { aud, paymentLabel, type OrderStatus } from '@/lib/orders-shared';
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
        <div className="bg-white border border-[#e5dec9] rounded-3xl p-8 text-center space-y-3 shadow-sm">
          <Inbox className="w-8 h-8 mx-auto text-[#b08d57]" />
          <p className="text-sm text-[#705d48] max-w-md mx-auto">
            {o ? 'That order link is invalid or was signed with a different secret.' : 'Every new order emails the sales desk a signed link. Tap "View Order in Admin" in that email to land here with the order loaded.'}
          </p>
          <Link href="/admin/portal" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8a6a2e] hover:underline">
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
        <section className="lg:col-span-2 bg-white border border-[#e5dec9] rounded-3xl p-6 space-y-4 hover:border-[#b08d57]/60 transition-colors shadow-sm">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a2e] font-bold">Customer</h2>
          <div className="text-lg font-serif font-bold text-[#232320]">{c.name}</div>
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#a08a63] mt-0.5 shrink-0" />
              <a href={`mailto:${c.email}`} className="hover:text-[#8a6a2e] break-all text-[#232320]">{c.email}</a>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#a08a63] mt-0.5 shrink-0" />
              {c.phone ? <a href={`tel:${c.phone}`} className="hover:text-[#8a6a2e] text-[#232320]">{c.phone}</a> : <span className="text-[#a08a63]">No phone given</span>}
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#a08a63] mt-0.5 shrink-0" />
              <span className="text-[#232320]">{c.postcode ? `${c.address ?? ''}${c.suburb ? `, ${c.suburb}` : ''} ${c.state ?? ''} ${c.postcode}` : <span className="text-[#a08a63]">Address not given</span>}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-[#a08a63] mt-0.5 shrink-0" />
              <span className="text-[#232320]">{paymentLabel(order.payment)}</span>
            </div>
          </dl>
          {(c.picNumber || c.needPicHelp) && (
            <div className="pt-2 border-t border-[#f0ebd9] text-xs text-[#a08a63]">
              PIC: {c.needPicHelp ? 'Assistance needed' : c.picNumber}
            </div>
          )}
        </section>

        <section className="lg:col-span-3 bg-white border border-[#e5dec9] rounded-3xl p-6 hover:border-[#b08d57]/60 transition-colors shadow-sm">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a2e] font-bold mb-4">Animal</h2>
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#f0ebd9]">
            <div>
              <div className="font-semibold leading-snug text-[#232320]">{order.animal.name}</div>
              <div className="text-xs text-[#a08a63] mt-0.5">{order.animal.earTag} &middot; {[order.animal.color, order.animal.sizeClass].filter(Boolean).join(' • ')}</div>
            </div>
            <div className="font-bold whitespace-nowrap shrink-0 text-[#232320]">{aud(order.totals.price)}</div>
          </div>
          <dl className="mt-4 space-y-1.5 text-sm">
            {order.totals.discount > 0 && <div className="flex justify-between text-[#1e7a46]"><dt>Crypto incentive 10%</dt><dd>&minus;{aud(order.totals.discount)}</dd></div>}
            <div className="flex justify-between text-[#a08a63]"><dt>Includes GST</dt><dd>{aud(order.totals.gst)}</dd></div>
            {order.totals.depositBalanceDue !== undefined && <div className="flex justify-between text-[#a08a63]"><dt>Balance due before dispatch</dt><dd>{aud(order.totals.depositBalanceDue)}</dd></div>}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#f0ebd9] text-[#8a6a2e]"><dt>{order.totals.depositBalanceDue !== undefined ? 'Deposit payable now' : 'Total'}</dt><dd>{aud(order.totals.total)}</dd></div>
          </dl>
        </section>
      </div>

      <div className="mt-6 bg-gradient-to-br from-[#fcf8ed] to-[#f5edd8] border-2 border-[#e5c07b] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="font-serif font-bold text-lg text-[#232320]">{order.status === 'new' ? 'Ready to invoice' : 'Invoice already sent'}</div>
          <p className="text-sm text-[#705d48]">The settlement terminal opens with every field from this order already filled.</p>
        </div>
        <Link href={settle} className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#b08d57] hover:bg-[#c9a367] text-white font-bold text-sm transition-all hover:-translate-y-px shadow-md w-full sm:w-auto justify-center">
          Go to settlement terminal
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-[#a08a63]">Status: {STATUS_LABEL[order.status]}.</p>
        <OrderStatusActions orderRef={order.ref} status={order.status} />
      </div>

      {events.length > 0 && (
        <section className="mt-6 bg-white border border-[#e5dec9] rounded-3xl p-6 shadow-sm">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a2e] font-bold mb-4">Activity</h2>
          <ol className="space-y-3">
            {events.map((e, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b08d57] mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-[#232320]">{STATUS_LABEL[e.status as OrderStatus] ?? e.status}</span>
                  {e.note ? <span className="text-[#705d48]"> — {e.note}</span> : null}
                  <div className="text-[11px] text-[#a08a63]">{new Date(e.at).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' })} AEST</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </AdminShell>
  );
}
