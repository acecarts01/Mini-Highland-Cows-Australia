// Persistence for the admin portal: orders and their status history.
// Everything else in the order system stays token-based and stateless -
// this table is purely so the portal has something to list. A write
// failure here never blocks an order from emailing out; it's logged and
// swallowed.
import { sql } from '@vercel/postgres';
import type { Order, OrderStatus } from './orders';

let migrated: Promise<void> | null = null;

// Neon's serverless compute can be cold (suspended after idle) on the first
// request to a warm lambda instance. If that first connection attempt ever
// throws, a naively-memoized promise would stay rejected forever for the
// life of the instance - clear the cache on failure so the next call gets a
// fresh attempt.
function migrate(): Promise<void> {
  if (!migrated) {
    migrated = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS orders (
        ref TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL,
        payment TEXT NOT NULL,
        customer JSONB NOT NULL,
        animal JSONB NOT NULL,
        totals JSONB NOT NULL,
        invoice JSONB,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS order_events (
        id SERIAL PRIMARY KEY,
        order_ref TEXT NOT NULL REFERENCES orders(ref) ON DELETE CASCADE,
        status TEXT NOT NULL,
        note TEXT,
        at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS order_events_ref_idx ON order_events (order_ref, at)`;
    })().catch((e) => {
      migrated = null;
      throw e;
    });
  }
  return migrated;
}

/** Retries a read once after a short delay - covers a cold Neon compute waking up. */
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return fn();
  }
}

export async function upsertOrder(order: Order, note?: string): Promise<void> {
  try {
    await withRetry(async () => {
      await migrate();
      await sql`
        INSERT INTO orders (ref, created_at, status, payment, customer, animal, totals, invoice, updated_at)
        VALUES (${order.ref}, ${order.createdAt}, ${order.status}, ${order.payment},
          ${JSON.stringify(order.customer)}::jsonb, ${JSON.stringify(order.animal)}::jsonb, ${JSON.stringify(order.totals)}::jsonb,
          ${order.invoice ? JSON.stringify(order.invoice) : null}::jsonb, now())
        ON CONFLICT (ref) DO UPDATE SET
          status = EXCLUDED.status,
          invoice = EXCLUDED.invoice,
          updated_at = now()
      `;
      await sql`INSERT INTO order_events (order_ref, status, note) VALUES (${order.ref}, ${order.status}, ${note ?? null})`;
    });
  } catch (e) {
    console.error('[db] upsertOrder failed (non-fatal):', e);
  }
}

export interface OrderRow {
  ref: string;
  createdAt: string;
  status: OrderStatus;
  payment: string;
  customer: Order['customer'];
  animal: Order['animal'];
  totals: Order['totals'];
  invoice: Order['invoice'] | null;
  updatedAt: string;
}

export async function listOrders(opts: { limit?: number; status?: string; search?: string } = {}): Promise<OrderRow[]> {
  return withRetry(async () => {
    await migrate();
    const limit = Math.min(200, Math.max(1, opts.limit ?? 50));
    const status = opts.status && opts.status !== 'all' ? opts.status : null;
    const search = opts.search ? `%${opts.search.toLowerCase()}%` : null;
    const { rows } = await sql`
      SELECT ref, created_at, status, payment, customer, animal, totals, invoice, updated_at
      FROM orders
      WHERE (${status}::text IS NULL OR status = ${status})
        AND (${search}::text IS NULL OR ref ILIKE ${search} OR customer->>'name' ILIKE ${search} OR customer->>'email' ILIKE ${search})
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return rows.map(rowToOrder);
  });
}

export async function getOrder(ref: string): Promise<OrderRow | null> {
  return withRetry(async () => {
    await migrate();
    const { rows } = await sql`SELECT ref, created_at, status, payment, customer, animal, totals, invoice, updated_at FROM orders WHERE ref = ${ref}`;
    return rows[0] ? rowToOrder(rows[0]) : null;
  });
}

export interface OrderEvent {
  status: string;
  note: string | null;
  at: string;
}

export async function getOrderEvents(ref: string): Promise<OrderEvent[]> {
  return withRetry(async () => {
    await migrate();
    const { rows } = await sql`SELECT status, note, at FROM order_events WHERE order_ref = ${ref} ORDER BY at ASC`;
    return rows.map((r) => ({ status: r.status, note: r.note, at: new Date(r.at).toISOString() }));
  });
}

export async function setOrderStatus(ref: string, status: OrderStatus, note?: string): Promise<void> {
  return withRetry(async () => {
    await migrate();
    await sql`UPDATE orders SET status = ${status}, updated_at = now() WHERE ref = ${ref}`;
    await sql`INSERT INTO order_events (order_ref, status, note) VALUES (${ref}, ${status}, ${note ?? null})`;
  });
}

export async function orderCounts(): Promise<Record<string, number>> {
  return withRetry(async () => {
    await migrate();
    const { rows } = await sql`SELECT status, count(*)::int AS n FROM orders GROUP BY status`;
    const out: Record<string, number> = {};
    for (const r of rows) out[r.status] = r.n;
    return out;
  });
}

export async function orderRevenue(): Promise<{ settled: number; pipeline: number }> {
  return withRetry(async () => {
    await migrate();
    const { rows } = await sql`
      SELECT
        COALESCE(SUM(CASE WHEN status IN ('paid', 'dispatched') THEN (totals->>'total')::numeric ELSE 0 END), 0) AS settled,
        COALESCE(SUM(CASE WHEN status NOT IN ('paid', 'dispatched') THEN (totals->>'total')::numeric ELSE 0 END), 0) AS pipeline
      FROM orders
    `;
    return { settled: Number(rows[0]?.settled ?? 0), pipeline: Number(rows[0]?.pipeline ?? 0) };
  });
}

function rowToOrder(r: any): OrderRow {
  return {
    ref: r.ref,
    createdAt: new Date(r.created_at).toISOString(),
    status: r.status,
    payment: r.payment,
    customer: r.customer,
    animal: r.animal,
    totals: r.totals,
    invoice: r.invoice,
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}
