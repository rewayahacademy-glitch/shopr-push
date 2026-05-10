'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { adminFetch } from '@/components/admin/useAdminFetch';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  affiliateUrl: string;
  imageUrl: string;
  categoryId: string;
  sourceName: string;
  sourceDomain: string;
  halalStatus: string;
  featured: boolean;
  qualityScore?: number;
  valueScore?: number;
  tags?: string[];
}

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        // On essaie d'abord de récupérer le produit directement via son ID
        const res = await adminFetch(`/api/admin/products/${id}`);
        if (res.status === 401) {
          setError('Non autorisé. Vérifiez votre token admin.');
          return;
        }
        if (!res.ok) {
          setError(`Erreur ${res.status}`);
          return;
        }
        const data = await res.json();
        if (!data || !data.id) {
          setError('Produit introuvable');
          return;
        }
        setProduct(data);
      } catch {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <span className="ml-3 text-gray-500">Chargement du produit...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Retour
        </Link>
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700">
          <p className="font-semibold">Erreur</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Retour
        </Link>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Modifier le produit</h2>
          <p className="text-sm text-gray-500 max-w-md truncate">{product?.name}</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {product && (
          <ProductForm
            mode="edit"
            productId={id}
            initialData={{
              name: product.name,
              slug: product.slug,
              description: product.description,
              shortDescription: product.shortDescription,
              price: String(product.price),
              currency: product.currency,
              affiliateUrl: product.affiliateUrl,
              imageUrl: product.imageUrl,
              categoryId: product.categoryId,
              sourceName: product.sourceName,
              sourceDomain: product.sourceDomain,
              halalStatus: product.halalStatus,
              featured: product.featured,
              qualityScore: String(product.qualityScore ?? 5),
              valueScore: String(product.valueScore ?? 5),
              tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
            }}
          />
        )}
      </div>
    </div>
  );
}
