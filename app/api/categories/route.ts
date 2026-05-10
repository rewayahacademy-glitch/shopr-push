export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/api/rate-limit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  if (!rateLimit(`pub:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { products: { where: { isAvailable: true, halalStatus: "allowed" } } } },
    },
    orderBy: { name: "asc" },
  });

  const res = NextResponse.json(
    categories.map((c) => ({ ...c, productCount: c._count.products }))
  );
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  return res;
}