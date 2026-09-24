import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/admin-auth';
import { setOrderStatus } from '@/lib/db';
import type { OrderStatus } from '@/lib/orders';

// POST /api/admin/orders/status  { ref, status } -> advances an order's
// status and logs it as an activity event. Used by the portal and order
// card for the steps that have no automated trigger (paid, dispatched).
const ADVANCEABLE: OrderStatus[] = ['paid', 'dispatched'];

export async function POST(request: Request) {
  const jar = await cookies();
  if (!verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ success: false, message: 'Not signed in.' }, { status: 401 });
  }
  let body: { ref?: string; status?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.ref || !ADVANCEABLE.includes(body.status as OrderStatus)) {
    return NextResponse.json({ success: false, message: 'Give an order ref and one of: paid, dispatched.' }, { status: 400 });
  }
  await setOrderStatus(body.ref, body.status as OrderStatus, `Marked ${body.status} from the admin portal`);
  return NextResponse.json({ success: true });
}
