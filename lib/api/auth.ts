import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "@/lib/api/compare";

export function requireAdmin(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.warn("ADMIN_SECRET not set in environment");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headerToken = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  if (headerToken && timingSafeEqual(headerToken, secret)) return null;

  const cookieToken = req.cookies.get("shopr_admin_session")?.value;
  if (cookieToken && timingSafeEqual(cookieToken, secret)) return null;

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}