export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CATEGORY_EMOJI } from '@/lib/constants';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import type { PageProps, Category, Product } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const STATIC_SLUGS = ['tech', 'mode', 'maison', 'sport', 'voyage', 'cuisine'];

export async function generateStaticParams() {
  return STATIC_SLUGS.map((slug) => ({ slug }));
}

async function getCategoryData(slug: string): Promise<{ category: Category | null; products: Product[] }> {
  try {
    const [catRes, productsRes] = await Promise.all([
      fetch(`${BASE_URL}/api/categories`, { next: { revalidate: 300 } }),
      fetch(`${BASE_URL}/api/categories/${slug}/products`, { next: { revalidate: 60 } }),
    ]);

    let category: Category | null = null;
    if (catRes.ok) {
      const cats: Category[] = await catRes.json();
      category = cats.find((c) => c.slug === slug) ?? null;
    }

    let products: Product[] = [];
    if (productsRes.ok) {
      const rawProducts = await productsRes.json();
      const list = Array.isArray(rawProducts) ? rawProducts : [];
      products = list.map((p: Record<string, unknown>): Product => ({
        id:               p.id as string,
        slug:             p.slug as string,
        name:             p.name as string,
        description:      (p.description as string) ?? '',
        shortDescription: (p.shortDescription as string) ?? '',
        categoryId:       ((p.category as Record<string, unknown>)?.id as string) ?? (p.categoryId as string) ?? '',
        categorySlug:     ((p.category as Record<string, unknown>)?.slug as string) ?? slug,
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
      }));
    }

    return { category, products };
  } catch {
    return { category: null, products: [] };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await getCategoryData(params.slug);
  if (!category) return { title: 'Catégorie introuvable' };
  return {
    title: `${category.name} | SHOPR Halal`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category, products } = await getCategoryData(params.slug);

  if (!category) notFound();

  const emoji = CATEGORY_EMOJI[category.slug] ?? '◆';

  return (
    <div className="min-h-screen bg-bg">

      <div className="gradient-teal py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl" aria-hidden>{emoji}</span>
            <p className="text-xs font-semibold tracking-widest uppercase text-salmon/80">
              Catégorie
            </p>
          </div>
          <h1 className="font-outfit font-bold text-h1 text-white mb-3">{category.name}</h1>
          <p className="text-white/65 text-sm sm:text-base max-w-xl">{category.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductFilters total={products.length} />
        <ProductGrid
          products={products}
          emptyMessage="Aucun produit dans cette catégorie pour l'instant. Revenez bientôt."
        />
      </div>
    </div>
  );
}
