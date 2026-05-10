/**
 * GET /api/admin/engine/review-queue
 * Returns all products pending manual halal review (status: needs_review | doubtful).
 * Supports ?status=needs_review|doubtful and ?limit=N
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/auth';
import { prisma } from '@/lib/db';
import { classifyHalalDetailed } from '@/lib/engine/modules/halalPolicyEngine';
import type { AffiliateSource } from '@/lib/types';

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');
  const limit = Math.min(Number(searchParams.get('limit') ?? '50'), 200);

  const validStatuses = ['needs_review', 'doubtful'] as const;
  const statusList = statusFilter && validStatuses.includes(statusFilter as typeof validStatuses[number])
    ? [statusFilter as typeof validStatuses[number]]
    : [...validStatuses];

  const products = await prisma.product.findMany({
    where:   { halalStatus: { in: statusList } },
    include: { category: { select: { slug: true, name: true } } },
    orderBy: { updatedAt: 'desc' },
    take:    limit,
  });

  const enriched = products.map((p) => {
    const engineProduct = {
      id:               p.id,
      slug:             p.slug,
      name:             p.name,
      description:      p.description,
      shortDescription: p.shortDescription,
      categoryId:       p.categoryId,
      categorySlug:     p.category.slug,
      categoryName:     p.category.name,
      imageUrl:         p.imageUrl,
      price:            p.price,
      originalPrice:    p.originalPrice ?? undefined,
      currency:         p.currency,
      affiliateUrl:     p.affiliateUrl,
      source:           { name: p.sourceName, domain: p.sourceDomain, logoUrl: p.sourceLogoUrl ?? undefined } as AffiliateSource,
      badges:           (Array.isArray(p.badges) ? p.badges : []) as [],
      qualityScore:     p.qualityScore,
      valueScore:       p.valueScore,
      trendingScore:    p.trendingScore ?? undefined,
      tags:             p.tags,
      isAvailable:      p.isAvailable,
      lastUpdated:      p.lastUpdated.toISOString(),
      featured:         p.featured,
    };

    const classification = classifyHalalDetailed(engineProduct);

    return {
      id:              p.id,
      name:            p.name,
      slug:            p.slug,
      halalStatus:     p.halalStatus,
      confidence:      classification.confidence,
      reasons:         classification.reasons,
      riskScores:      classification.riskScores,
      affiliateUrl:    p.affiliateUrl,
      imageUrl:        p.imageUrl,
      price:           p.price,
      currency:        p.currency,
      category:        p.category.name,
      rejectionReasons: p.rejectionReasons,
      updatedAt:       p.updatedAt,
    };
  });

  return NextResponse.json({ queue: enriched, count: enriched.length });
}
