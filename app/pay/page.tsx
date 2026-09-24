import React from 'react';
import type { Metadata } from 'next';
import { verifyOrder } from '@/lib/orders';
import PayInvoice from './PayInvoice';

// /pay?i=<token> - the client's hosted invoice. The token is the same signed
// order the email carries, so the page cannot be guessed or edited; it is
// never indexed.
export const metadata: Metadata = {
  title: 'Your invoice — Mini Highland Cows',
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = 'force-dynamic';

export default async function PayPage({ searchParams }: { searchParams: Promise<{ i?: string }> }) {
  const { i } = await searchParams;
  const order = verifyOrder(i);
  const valid = order && order.invoice;
  return <PayInvoice order={valid ? order : null} />;
}
