import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/api/rate-limit';
import { timingSafeEqual } from '@/lib/api/compare';

const COOKIE = 'shopr_admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';
  if (!rateLimit(`login:${ip}`, 5, 60 * 1000)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans une minute.' }, { status: 429 });
  }

  const { token } = await req.json().catch(() => ({ token: '' }));
  const secret = process.env.ADMIN_SECRET || '';

  if (!token || !timingSafeEqual(token, secret)) {
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
