import { prisma } from '@/lib/db';
import type { ReviewProduct, HalalStatus } from '../types';
import type { AffiliateSource } from '@/lib/types';

export async function addToReviewQueue(items: ReviewProduct[]): Promise<void> {
  if (items.length === 0) return;
  await Promise.all(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.product.id },
        data: {
          halalStatus:      item.halalStatus,
          rejectionReasons: item.reasons.slice(0, 20),
          isAvailable:      false,
          totalScore:       0,
        },
      }).catch((err) => {
        console.error(`[manualReviewQueue] failed to persist review for product ${item.product.id}:`, err);
      })
    )
  );
}

export async function getReviewQueue(): Promise<ReviewProduct[]> {
  const products = await prisma.product.findMany({
    where:   { halalStatus: { in: ['needs_review', 'doubtful'] } },
    include: { category: { select: { slug: true, name: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  return products.map((p) => ({
    product: {
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
    },
    flaggedFor:  p.rejectionReasons[0] ?? 'manual_review',
    halalStatus: p.halalStatus as HalalStatus,
    confidence:  0,
    reasons:     p.rejectionReasons,
  }));
}

// No-op: the queue is the DB itself — individual product updates manage state.
export async function clearReviewQueue(): Promise<void> {}
