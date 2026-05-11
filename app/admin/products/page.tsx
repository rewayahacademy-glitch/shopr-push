'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import { adminFetch } from '@/components/admin/useAdminFetch';

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: { name: string };
  categoryName?: string;
  price: number;
  currency: string;
  halalStatus: string;
  totalScore?: number;
  qualityScore?: number;
  createdAt: string;
  imageUrl?: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'allowed', label: 'Approuvés' },
  { value: 'needs_review', label: 'En révision' },
  { value: 'doubtful', label: 'Douteux' },
  { value: 'forbidden', label: 'Rejetés' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/admin/products');
      if (res.status === 401) {
        setError('Non autorisé. Vérifiez votre token admin.');
        return;
      }
      if (!res.ok) {
        setError(`Erreur ${res.status}`);
        return;
      }
      const data = await res.json();
      // API retourne { data: [...], nextCursor, hasMore, count }
      const arr = Array.isArray(data) ? data : data?.data ?? data?.products ?? data?.items ?? [];
      setProducts(arr);
      setFiltered(arr);
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      setFiltered(products.filter((p) => p.halalStatus === statusFilter));
    } else {
      setFiltered(products);
    }
  }, [statusFilter, products]);

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadProducts();
        setDeleteConfirm(null);
      } else {
        setError('Erreur lors de la suppression');
        setDeleting(false);
      }
    } catch {
      setError('Erreur réseau lors de la suppression');
      setDeleting(false);
    }
  }

  async function handleHalalToggle(id: string, newStatus: string) {
    try {
      const res = await adminFetch(`/api/admin/products/${id}/halal`, {
        method: 'POST',
        body: JSON.stringify({ halalStatus: newStatus }),
      });
      if (res.ok) {
        await loadProducts();
      } else {
        setError('Erreur lors du changement de statut');
      }
    } catch {
      setError('Erreur réseau lors du changement de statut');
    }
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString('fr-FR');
    } catch {
      return iso;
    }
  }

  function formatPrice(price: number, currency: string) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'EUR' }).format(price);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Produits</h2>
          <p className="text-sm text-gray-500">{products.length} produit{products.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          + Ajouter un produit
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-3">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === opt.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <span className="ml-3 text-gray-500">Chargement...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Catégorie</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Statut Halal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    {/* Nom */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-9 w-9 rounded-lg object-cover border border-gray-100"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 max-w-[200px] truncate">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    {/* Catégorie */}
                    <td className="px-4 py-3 text-gray-600">
                      {product.category?.name ?? product.categoryName ?? product.categoryId ?? '—'}
                    </td>
                    {/* Prix */}
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {formatPrice(product.price, product.currency)}
                    </td>
                    {/* Statut */}
                    <td className="px-4 py-3">
                      <StatusBadge status={product.halalStatus} />
                    </td>
                    {/* Score */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-700">
                        {product.totalScore != null
                          ? product.totalScore.toFixed(1)
                          : product.qualityScore != null
                          ? product.qualityScore.toFixed(1)
                          : '—'}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(product.createdAt)}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmation suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
            <p className="mt-2 text-sm text-gray-600">
              Cette action est irréversible. Le produit sera définitivement supprimé.
            </p>
            <div className="mt-5 flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {deleting ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
