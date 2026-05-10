import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'shopr_admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({ token: '' }));

  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}
