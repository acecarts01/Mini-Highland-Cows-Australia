import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, issueAdminCookie, passphraseMatches } from '@/lib/admin-auth';

// POST { passphrase } -> sets the admin cookie. DELETE -> clears it.
export async function POST(request: Request) {
  let passphrase = '';
  try {
    const body = await request.json();
    passphrase = String(body.passphrase ?? '');
  } catch {
    /* fall through */
  }
  // Small fixed delay blunts brute force without needing state.
  await new Promise((r) => setTimeout(r, 400));
  if (!passphraseMatches(passphrase)) {
    return NextResponse.json({ success: false, message: 'That passphrase is not right.' }, { status: 401 });
  }
  const { value, expires } = issueAdminCookie();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', expires: new Date(0) });
  return res;
}
