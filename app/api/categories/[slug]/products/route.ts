export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const sort = new URL(req.url).searchParams.get("sort") ?? "trending";
  const orderByMap: Record<string, object> = {
    trending: { trendingScore: "desc" },
    value: { valueScore: "desc" },
    "price-asc": { price: "asc" },
    "price-desc": { price: "desc" },
    newest: { createdAt: "desc" },
  };

  const products = await prisma.product.findMany({
    where: { category: { slug: params.slug }, isAvailable: true, halalStatus: "allowed" },
    include: { category: true },
    orderBy: orderByMap[sort] ?? { trendingScore: "desc" },
  });

  return NextResponse.json(products);
}