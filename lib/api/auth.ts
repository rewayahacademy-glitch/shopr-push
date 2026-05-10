import { NextRequest, NextResponse } from "next/server";

export function requireAdmin(req: NextRequest): NextResponse | null {
  const token = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}