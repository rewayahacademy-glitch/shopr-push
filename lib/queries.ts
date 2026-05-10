/**
 * Server-side data access — always runs on the server, never in the browser.
 * Returns data typed to match lib/types.ts for direct use by components.
 */

import { prisma } from './db';
import type { Category, Product } from './types';
import { CATEGORY_LUCIDE_ICON } from './constants';

/* ── Internal helpers ──────────────────────────────────────── */

type DbProduct = {
  id: string; slug: string; name: string; description: string;
  shortDescription: string; categoryId: string;
  category: { slug: string; name: string };
  imageUrl: string; images: string[];
  price: number; originalPrice: number | null;
  currency: string; affiliateUrl: string;
  sourceName: string; sourceDomain: string; sourceLogoUrl: string | null;
  badges: unknown; qualityScore: number; valueScore: number;
  trendingScore: number | null; tags: string[];
  isAvailable: boolean; featured: boolean; lastUpdated: Date;
};

function toProduct(p: DbProduct): Product {
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
    images:           p.images,
    price:            p.price,
    originalPrice:    p.originalPrice ?? undefined,
    currency:         p.currency,
    affiliateUrl:     p.affiliateUrl,
    source:           { name: p.sourceName, domain: p.sourceDomain, logoUrl: p.sourceLogoUrl ?? undefined },
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

/* ── Public query functions ────────────────────────────────── */

export async function getCategories(): Promise<Category[]> {
  const cats = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: { where: { isAvailable: true, halalStatus: 'allowed' } },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return cats.map((c) => ({
    id:           c.id,
    slug:         c.slug,
    name:         c.name,
    description:  c.description,
    icon:         CATEGORY_LUCIDE_ICON[c.slug] ?? c.icon,
    productCount: c._count.products,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const c = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          products: { where: { isAvailable: true, halalStatus: 'allowed' } },
        },
      },
    },
  });

  if (!c) return null;

  return {
    id:           c.id,
    slug:         c.slug,
    name:         c.name,
    description:  c.description,
    icon:         CATEGORY_LUCIDE_ICON[c.slug] ?? c.icon,
    productCount: c._count.products,
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const ps = await prisma.product.findMany({
    where:   { featured: true, isAvailable: true, halalStatus: 'allowed' },
    include: { category: true },
    orderBy: { totalScore: 'desc' },
  });
  return ps.map(toProduct);
}

export async function getTrendingProducts(limit = 4): Promise<Product[]> {
  const ps = await prisma.product.findMany({
    where:   { isAvailable: true, halalStatus: 'allowed' },
    include: { category: true },
    orderBy: { trendingScore: 'desc' },
    take:    limit,
  });
  return ps.map(toProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const ps = await prisma.product.findMany({
    where: {
      isAvailable: true,
      halalStatus: 'allowed',
      category:    { slug: categorySlug },
    },
    include: { category: true },
    orderBy: { totalScore: 'desc' },
  });
  return ps.map(toProduct);
}
