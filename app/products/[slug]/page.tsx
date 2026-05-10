import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { PageProps, Product } from '@/lib/types';
import ProductDetail from '@/components/products/ProductDetail';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;

    const p = await res.json();
    if (!p || p.error) return null;

    return {
      id:               p.id,
      slug:             p.slug,
      name:             p.name,
      description:      p.description ?? '',
      shortDescription: p.shortDescription ?? '',
      categoryId:       p.category?.id ?? p.categoryId ?? '',
      categorySlug:     p.category?.slug ?? '',
      categoryName:     p.category?.name ?? '',
      imageUrl:         p.imageUrl,
      images:           Array.isArray(p.images) ? p.images : [],
      price:            p.price,
      originalPrice:    p.originalPrice ?? undefined,
      currency:         p.currency ?? 'EUR',
      affiliateUrl:     p.affiliateUrl,
      source:           {
        name:    p.sourceName ?? '',
        domain:  p.sourceDomain ?? '',
        logoUrl: p.sourceLogoUrl ?? undefined,
      },
      badges:        Array.isArray(p.badges) ? p.badges : [],
      qualityScore:  p.qualityScore ?? 0,
      valueScore:    p.valueScore ?? 0,
      trendingScore: p.trendingScore ?? undefined,
      tags:          Array.isArray(p.tags) ? p.tags : [],
      isAvailable:   p.isAvailable ?? true,
      lastUpdated:   p.lastUpdated ?? new Date().toISOString(),
      featured:      p.featured ?? false,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Produit introuvable | SHOPR Halal' };
  return {
    title: `${product.name} | SHOPR Halal`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.slug);

  // Produit introuvable ou non-certifié halal
  if (!product) notFound();

  // Règle absolue : ne jamais afficher si affiliateUrl est vide/null/"#"
  const hasValidAffiliateUrl =
    product.affiliateUrl &&
    product.affiliateUrl !== '#' &&
    product.affiliateUrl.startsWith('http');

  if (!hasValidAffiliateUrl) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <ProductDetail product={product} />
    </div>
  );
}
