// Browser-safe order types and helpers (no node:crypto). lib/orders.ts
// re-exports these and adds pricing, signing and URLs for the server.
import { CONTACT } from '@/lib/site-config';

export type PaymentMethod = 'bank' | 'crypto' | 'deposit';
export type OrderStatus = 'new' | 'invoice_sent' | 'paid' | 'dispatched';

export interface OrderAnimal {
  id: string;
  slug: string;
  name: string;
  earTag: string;
  image: string;
  color?: string;
  sizeClass?: string;
}

export interface OrderTotals {
  price: number;
  discount: number;
  total: number;
  /** GST component of `total` (prices are GST-inclusive: total / 11). */
  gst: number;
  /** Set only for payment === 'deposit': the remaining 80% due before dispatch. */
  depositBalanceDue?: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  paddockAccessNotes?: string;
  picNumber?: string;
  needPicHelp?: boolean;
}

export interface Order {
  ref: string;
  createdAt: string;
  status: OrderStatus;
  customer: OrderCustomer;
  animal: OrderAnimal;
  payment: PaymentMethod;
  totals: OrderTotals;
  /** Set by the settlement terminal when the invoice goes out. */
  invoice?: InvoiceDetails;
}

export interface InvoiceDetails {
  issuedAt: string;
  method: 'bank' | 'crypto';
  bank?: { accountName: string; bsb: string; accountNumber: string; payId?: string };
  crypto?: { walletKey: string; asset: string; network: string; address: string };
  notes?: string;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'New Order',
  invoice_sent: 'Invoice Sent',
  paid: 'Paid',
  dispatched: 'Dispatched',
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  bank: 'Bank EFT / PayID',
  crypto: 'Crypto - BTC / USDT (10% discount applied)',
  deposit: '20% Holding Deposit',
};
export const paymentLabel = (p: PaymentMethod) => PAYMENT_LABEL[p];

export const aud = (n: number) => `$${n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} AUD`;

/** Customer-side WhatsApp message: sent to the sales desk to confirm an order. */
export function whatsappOrderMessage(order: Order): string {
  return [
    `New Order ${order.ref} - Mini Highland Cows`,
    ``,
    `Animal: ${order.animal.name} (${order.animal.earTag})`,
    `Total: ${aud(order.totals.total)}`,
    `Payment: ${paymentLabel(order.payment)}`,
    `Name: ${order.customer.name}`,
    order.customer.postcode ? `Postcode: ${order.customer.postcode}` : null,
    ``,
    `Please confirm my order. I'll follow up here once I've paid.`,
  ]
    .filter((x) => x !== null)
    .join('\n');
}

export function whatsappOrderUrl(order: Order): string {
  return `https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=${encodeURIComponent(whatsappOrderMessage(order))}`;
}

/** Client's payment-receipt WhatsApp message from the pay page. */
export function whatsappReceiptUrl(order: Order): string {
  const text = `Payment receipt for order ${order.ref} (${order.animal.name}) - receipt/screenshot attached below.`;
  return `https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=${encodeURIComponent(text)}`;
}

/** Client's payment-receipt email from the pay page — the other half of the WhatsApp option. */
export function mailtoReceiptUrl(order: Order): string {
  const subject = `Payment receipt for order ${order.ref}`;
  const body = `Hi Mini Highland Cows,\n\nI've paid for order ${order.ref} (${order.animal.name}). Receipt/screenshot attached.\n\nThanks,\n${order.customer.name}`;
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
