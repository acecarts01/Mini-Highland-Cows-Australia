import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import { verifyOrder } from '@/lib/orders';
import AdminShell from '@/components/admin/AdminShell';
import SettleTerminal from '@/components/admin/SettleTerminal';

// /admin/orders/settle?o=<token> - the pre-filled settlement terminal.
// Bank details can be pre-loaded from env so the desk never retypes them:
//   BANK_ACCOUNT_NAME, BANK_BSB, BANK_ACCOUNT_NUMBER, BANK_PAYID
export default async function SettlePage({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  if (!(await isAdminRequest())) redirect(`/admin/login?next=${encodeURIComponent(`/admin/orders/settle${o ? `?o=${o}` : ''}`)}`);
  const order = verifyOrder(o);
  if (!order || !o) redirect('/admin/portal');

  const bankDefaults = {
    accountName: process.env.BANK_ACCOUNT_NAME ?? '',
    bsb: process.env.BANK_BSB ?? '',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? '',
    payId: process.env.BANK_PAYID ?? '',
  };

  return (
    <AdminShell wide title={`Settle ${order.ref}`} subtitle={`${order.customer.name} · ${order.customer.email} · every order field is loaded and locked; you only add the payment coordinates.`}>
      <SettleTerminal token={o} order={order} bankDefaults={bankDefaults} />
    </AdminShell>
  );
}
