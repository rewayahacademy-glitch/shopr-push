export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/api/rate-limit";
import { PaginationSchema } from "@/lib/api/validate";
import { buildCursorArgs, paginatedResponse } from "@/lib/api/paginate";

const ORDER_MAP: Record<string, object> = {
  trending:    { trendingScore: "desc" },
  value:       { valueScore: "desc" },
  "price-asc": { price: "asc" },
  "price-desc":{ price: "desc" },
  newest:      { createdAt: "desc" },
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  if (!rateLimit(`pub:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const { cursor, limit } = PaginationSchema.parse(sp);
  const { sort = "trending", category, priceMax, featured } = sp;

  const items = await prisma.product.findMany({
    where: {
      isAvailable: true,
      halalStatus: "allowed",
      ...(category ? { category: { slug: category } } : {}),
      ...(priceMax ? { price: { lte: Number(priceMax) } } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    },
    select: {
      id: true, slug: true, name: true, shortDescription: true,
      imageUrl: true, price: true, originalPrice: true, currency: true,
      affiliateUrl: true, sourceName: true, sourceDomain: true,
      badges: true, qualityScore: true, valueScore: true, trendingScore: true,
      halalStatus: true, tags: true, featured: true, lastUpdated: true,
      category: { select: { slug: true, name: true, icon: true } },
    },
    orderBy: ORDER_MAP[sort] ?? ORDER_MAP.trending,
    ...buildCursorArgs(cursor, limit),
  });

  const res = NextResponse.json(paginatedResponse(items, limit));
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res;
}