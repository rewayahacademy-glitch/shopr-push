export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/auth";

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const sp = new URL(req.url).searchParams;
  const days = Math.min(Number(sp.get("days") ?? "30"), 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    totalProducts,
    availableProducts,
    halalBreakdown,
    totalCategories,
    totalClicks,
    clicksInPeriod,
    topClickedProducts,
    clicksByDay,
    recentLogs,
    featuredCount,
    pendingReview,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.product.groupBy({ by: ["halalStatus"], _count: true }),
    prisma.category.count(),
    prisma.affiliateClick.count(),
    prisma.affiliateClick.count({ where: { createdAt: { gte: since } } }),

    // Top 10 produits les plus cliqués sur la période
    prisma.affiliateClick.groupBy({
      by: ["productId"],
      where: { createdAt: { gte: since } },
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 10,
    }),

    // Clics par jour (raw — needed for chart)
    prisma.$queryRawUnsafe<Array<{ day: string; clicks: number }>>(
      `SELECT DATE_TRUNC('day', "createdAt")::date::text AS day, COUNT(*)::int AS clicks
       FROM "AffiliateClick"
       WHERE "createdAt" >= $1
       GROUP BY 1 ORDER BY 1`,
      since
    ),

    prisma.adminLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.product.count({ where: { featured: true, isAvailable: true } }),
    prisma.product.count({ where: { halalStatus: "needs_review" } }),
  ]);

  // Enrich top products with names
  const productIds = topClickedProducts.map((r) => r.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, slug: true, price: true, affiliateUrl: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  const topProducts = topClickedProducts.map((r) => ({
    ...productMap[r.productId],
    clicks: r._count.productId,
  }));

  return NextResponse.json({
    overview: {
      totalProducts,
      availableProducts,
      unavailableProducts: totalProducts - availableProducts,
      featuredCount,
      pendingReview,
      totalCategories,
      totalClicks,
      clicksInPeriod,
      periodDays: days,
    },
    halalBreakdown: Object.fromEntries(halalBreakdown.map((h) => [h.halalStatus, h._count])),
    topProducts,
    clicksByDay,
    recentLogs,
  });
}