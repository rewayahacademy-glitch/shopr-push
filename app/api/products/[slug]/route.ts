export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/api/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  if (!rateLimit(`pub:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isAvailable: true, halalStatus: "allowed" },
    include: { category: { select: { id: true, slug: true, name: true, icon: true } } },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const res = NextResponse.json(product);
  res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
  return res;
}