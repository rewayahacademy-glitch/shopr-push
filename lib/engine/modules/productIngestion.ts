import type { Product } from '../../types';

export function ingestProducts(raw: unknown[]): Product[] {
  return raw
    .filter((item): item is Record<string, unknown> =>
      typeof item === 'object' && item !== null,
    )
    .map((item) => ({
      id:               String(item.id ?? ''),
      slug:             String(item.slug ?? ''),
      name:             String(item.name ?? ''),
      description:      String(item.description ?? ''),
      shortDescription: String(item.shortDescription ?? ''),
      categoryId:       String(item.categoryId ?? ''),
      categorySlug:     String(item.categorySlug ?? ''),
      categoryName:     String(item.categoryName ?? ''),
      imageUrl:         String(item.imageUrl ?? ''),
      price:            Number(item.price ?? 0),
      originalPrice:    item.originalPrice != null ? Number(item.originalPrice) : undefined,
      currency:         String(item.currency ?? 'EUR'),
      affiliateUrl:     String(item.affiliateUrl ?? ''),
      source:           (item.source as Product['source']) ?? { name: '', domain: '' },
      badges:           Array.isArray(item.badges) ? (item.badges as Product['badges']) : [],
      qualityScore:     Number(item.qualityScore ?? 0),
      valueScore:       Number(item.valueScore ?? 0),
      trendingScore:    item.trendingScore != null ? Number(item.trendingScore) : undefined,
      tags:             Array.isArray(item.tags) ? item.tags.map(String) : [],
      isAvailable:      Boolean(item.isAvailable ?? true),
      lastUpdated:      String(item.lastUpdated ?? new Date().toISOString()),
      featured:         Boolean(item.featured ?? false),
    } satisfies Product))
    .filter((p) => p.id !== '' && p.name !== '');
}
