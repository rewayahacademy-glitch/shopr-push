/**
 * scoreUpdater — reads products from DB, runs the full engine,
 * and writes scores + halal status + rejection reasons back.
 *
 * Called by POST /api/engine/score (admin-protected)
 * or any scheduled cron job.
 */

import { prisma } from '@/lib/db';
import { runExclusion } from '../modules/exclusionEngine';
import { computeScore } from '../modules/rankingEngine';
import { classifyHalalDetailed } from '../modules/halalPolicyEngine';
import type { Product, AffiliateSource } from '@/lib/types';

function toEngineProduct(p: {
  id: string; slug: string; name: string; description: string;
  shortDescription: string; categoryId: string;
  category: { slug: string; name: string };
  imageUrl: string; price: number; originalPrice: number | null;
  currency: string; affiliateUrl: string; sourceName: string;
  sourceDomain: string; sourceLogoUrl: string | null;
  badges: unknown; qualityScore: number; valueScore: number;
  trendingScore: number | null; tags: string[];
  isAvailable: boolean; featured: boolean; lastUpdated: Date;
}): Product {
  return {
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
    badges:           (Array.isArray(p.badges) ? p.badges : []) as Product['badges'],
    qualityScore:     p.qualityScore,
    valueScore:       p.valueScore,
    trendingScore:    p.trendingScore ?? undefined,
    tags:             p.tags,
    isAvailable:      p.isAvailable,
    lastUpdated:      p.lastUpdated.toISOString(),
    featured:         p.featured,
  };
}

export async function updateAllScores(geo?: string): Promise<{
  scored:   number;
  rejected: number;
  review:   number;
}> {
  const dbProducts = await prisma.product.findMany({ include: { category: true } });
  const engineProducts = dbProducts.map(toEngineProduct);
  const { accepted, rejected, review } = runExclusion(engineProducts);

  const acceptedUpdates = accepted.map((p) => {
    const score = computeScore(p, geo);
    const cls   = classifyHalalDetailed(p);
    return prisma.product.update({
      where: { id: p.id },
      data: {
        halalStatus:        cls.halalStatus,
        /* Re-enable products that previously failed but now pass all checks */
        isAvailable:        true,
        affiliateScore:     score.affiliateScore,
        complianceScore:    score.complianceScore,
        qualityPriceScore:  score.qualityPriceScore,
        merchantTrustScore: score.merchantTrustScore,
        trendScore:         score.trendScore,
        seasonalScore:      score.seasonalScore,
        totalScore:         score.totalScore,
        rejectionReasons:   [],
      },
    });
  });

  const rejectedUpdates = rejected.map((r) => {
    const cls = classifyHalalDetailed(r.product);
    return prisma.product.update({
      where: { id: r.product.id },
      data: {
        totalScore:       0,
        halalStatus:      cls.halalStatus,
        rejectionReasons: [...r.reasons, ...cls.reasons].slice(0, 20),
        isAvailable:      false,
      },
    });
  });

  const reviewUpdates = review.map((rv) =>
    prisma.product.update({
      where: { id: rv.product.id },
      data: {
        halalStatus:      rv.halalStatus,
        rejectionReasons: rv.reasons.slice(0, 20),
        totalScore:       0,
        isAvailable:      false,
      },
    }),
  );

  await Promise.all([...acceptedUpdates, ...rejectedUpdates, ...reviewUpdates]);

  return { scored: accepted.length, rejected: rejected.length, review: review.length };
}
