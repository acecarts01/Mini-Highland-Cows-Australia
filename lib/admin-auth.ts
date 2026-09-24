// Admin session: a passphrase (ADMIN_PASSPHRASE) exchanged for a signed,
// HttpOnly cookie. Stateless - the cookie is an expiry timestamp plus an
// HMAC over it with ORDER_SIGNING_SECRET, so nothing is stored server-side.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'mhc_admin';
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret(): string {
  const s = process.env.ORDER_SIGNING_SECRET;
  if (!s || s.length < 16) throw new Error('ORDER_SIGNING_SECRET is not set');
  return s;
}

function sign(exp: number): string {
  return createHmac('sha256', secret()).update(`admin:${exp}`).digest('base64url');
}

export function issueAdminCookie(): { value: string; expires: Date } {
  const exp = Date.now() + TTL_MS;
  return { value: `${exp}.${sign(exp)}`, expires: new Date(exp) };
}

export function verifyAdminCookie(value: string | undefined): boolean {
  if (!value) return false;
  const [expStr, sig] = value.split('.');
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function passphraseMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSPHRASE || '';
  if (!expected || expected.length < 8) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Server components: is this request an admin session? */
export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value);
}
