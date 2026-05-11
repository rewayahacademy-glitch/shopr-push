'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/components/admin/useAdminFetch';
import { slugify } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  _count?: { products: number };
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '◈',
  });

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/admin/categories');
      if (res.status === 401) {
        setError('Non autorisé. Vérifiez votre token admin.');
        return;
      }
      if (!res.ok) {
        setError(`Erreur ${res.status}`);
        return;
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.categories ?? data?.items ?? [];
      setCategories(arr);
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugManual ? prev.slug : slugify(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError('Le nom et le slug sont requis');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await adminFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        setFormError('Non autorisé. Vérifiez votre token admin.');
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setFormError(err?.error ?? err?.message ?? `Erreur ${res.status}`);
        return;
      }

      setFormSuccess(true);
      setForm({ name: '', slug: '', description: '', icon: '◈' });
      setSlugManual(false);
      await loadCategories();
      setTimeout(() => setFormSuccess(false), 3000);
    } catch {
      setFormError('Erreur réseau');
    } finally {
      setSubmitting(false);
    }
  }

  function getProductCount(cat: Category): number {
    return cat._count?.products ?? cat.productCount ?? 0;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Catégories</h2>
        <p className="text-sm text-gray-500">{categories.length} catégorie{categories.length !== 1 ? 's' : ''} au total</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Formulaire d'ajout */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Ajouter une catégorie</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Ex: Mode & Vêtements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    setForm((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="mode-vetements"
                />
                <p className="mt-1 text-xs text-gray-400">Auto-généré depuis le nom</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Description de la catégorie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icône (emoji)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="◈"
                  maxLength={4}
                />
              </div>

              {formError && (
                <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                  {formError}
                </p>
              )}
              {formSuccess && (
                <p className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700 font-medium">
                  Catégorie créée avec succès !
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
              >
                {submitting && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                Créer la catégorie
              </button>
            </form>
          </div>
        </div>

        {/* Table des catégories */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
              <span className="ml-3 text-gray-500">Chargement...</span>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Catégorie
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Slug
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Produits
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                        Aucune catégorie. Créez-en une ci-contre.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="font-medium text-gray-900">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-indigo-50 px-2 text-xs font-semibold text-indigo-600">
                            {getProductCount(cat)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              cat.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {cat.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                          {cat.description || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
