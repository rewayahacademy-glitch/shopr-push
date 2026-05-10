import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'shopr_admin_session';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (but not /admin/login itself)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = req.cookies.get(COOKIE)?.value;

  if (!session || session !== ADMIN_SECRET) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
