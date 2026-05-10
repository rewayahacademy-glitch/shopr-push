export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrendingSection from '@/components/home/TrendingSection';
import ValueProposition from '@/components/home/ValueProposition';
import NewsletterBanner from '@/components/home/NewsletterBanner';
import type { Product, Category } from '@/lib/types';

export const metadata: Metadata = {
  title: 'SHOPR — Shopping intelligent, sélection premium',
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getHomeData(): Promise<{
  categories: Category[];
  featured: Product[];
  trending: Product[];
}> {
  try {
    const [productsRes, categoriesRes, trendingRes] = await Promise.all([
      fetch(`${BASE_URL}/api/products?limit=8&featured=true`, { next: { revalidate: 60 } }),
      fetch(`${BASE_URL}/api/categories`, { next: { revalidate: 300 } }),
      fetch(`${BASE_URL}/api/products?limit=4&sort=trending`, { next: { revalidate: 60 } }),
    ]);

    const [productsData, categoriesData, trendingData] = await Promise.all([
      productsRes.ok ? productsRes.json() : { data: [] },
      categoriesRes.ok ? categoriesRes.json() : [],
      trendingRes.ok ? trendingRes.json() : { data: [] },
    ]);

    // Normalize raw API products to Product type
    const normalizeProduct = (p: Record<string, unknown>): Product => ({
      id:               p.id as string,
      slug:             p.slug as string,
      name:             p.name as string,
      description:      (p.description as string) ?? '',
      shortDescription: p.shortDescription as string,
      categoryId:       ((p.category as Record<string, unknown>)?.id as string) ?? (p.categoryId as string) ?? '',
      categorySlug:     ((p.category as Record<string, unknown>)?.slug as string) ?? '',
      categoryName:     ((p.category as Record<string, unknown>)?.name as string) ?? '',
      imageUrl:         p.imageUrl as string,
      images:           Array.isArray(p.images) ? (p.images as string[]) : [],
      price:            p.price as number,
      originalPrice:    (p.originalPrice as number) ?? undefined,
      currency:         (p.currency as string) ?? 'EUR',
      affiliateUrl:     p.affiliateUrl as string,
      source:           { name: p.sourceName as string, domain: p.sourceDomain as string },
      badges:           Array.isArray(p.badges) ? (p.badges as Product['badges']) : [],
      qualityScore:     (p.qualityScore as number) ?? 0,
      valueScore:       (p.valueScore as number) ?? 0,
      trendingScore:    (p.trendingScore as number) ?? undefined,
      tags:             Array.isArray(p.tags) ? (p.tags as string[]) : [],
      isAvailable:      (p.isAvailable as boolean) ?? true,
      lastUpdated:      (p.lastUpdated as string) ?? new Date().toISOString(),
      featured:         (p.featured as boolean) ?? false,
    });

    const rawFeatured  = Array.isArray(productsData.data)  ? productsData.data  : [];
    const rawTrending  = Array.isArray(trendingData.data)  ? trendingData.data  : [];

    return {
      categories: Array.isArray(categoriesData) ? categoriesData : [],
      featured:   rawFeatured.map(normalizeProduct),
      trending:   rawTrending.map(normalizeProduct),
    };
  } catch {
    return { categories: [], featured: [], trending: [] };
  }
}

export default async function HomePage() {
  const { categories, featured, trending } = await getHomeData();

  const heroProducts = featured.slice(0, 3);
  const featuredProducts = featured;

  return (
    <>
      <Hero products={heroProducts} />

      <div className="h-px bg-gradient-to-r from-transparent via-teal/10 to-transparent" />

      <div className="gradient-section-light">
        <CategoryGrid categories={categories} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-teal/10 to-transparent" />

      <div className="gradient-page">
        <FeaturedProducts products={featuredProducts} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-teal/10 to-transparent" />

      <div className="gradient-section-dark">
        <ValueProposition />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-salmon/10 to-transparent" />

      <div className="gradient-section-light">
        <TrendingSection products={trending} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-teal/10 to-transparent" />

      <NewsletterBanner />
    </>
  );
}
