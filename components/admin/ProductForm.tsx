'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/components/admin/useAdminFetch';
import { slugify } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  currency: string;
  affiliateUrl: string;
  imageUrl: string;
  categoryId: string;
  sourceName: string;
  sourceDomain: string;
  halalStatus: string;
  featured: boolean;
  qualityScore: string;
  valueScore: string;
  tags: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData & { qualityScore?: string | number; valueScore?: string | number; tags?: string | string[] }>;
  productId?: string;
  mode: 'create' | 'edit';
}

const HALAL_STATUS_OPTIONS = [
  { value: 'allowed', label: 'Approuvé (Halal)' },
  { value: 'needs_review', label: 'En révision' },
  { value: 'doubtful', label: 'Douteux' },
  { value: 'forbidden', label: 'Rejeté (Haram)' },
];

const CURRENCY_OPTIONS = ['EUR', 'USD', 'GBP', 'MAD', 'DZD', 'TND'];

export default function ProductForm({ initialData, productId, mode }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [slugManual, setSlugManual] = useState(!!initialData?.slug);

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    shortDescription: initialData?.shortDescription ?? '',
    price: initialData?.price ?? '',
    currency: initialData?.currency ?? 'EUR',
    affiliateUrl: initialData?.affiliateUrl ?? '',
    imageUrl: initialData?.imageUrl ?? '',
    categoryId: initialData?.categoryId ?? '',
    sourceName: initialData?.sourceName ?? '',
    sourceDomain: initialData?.sourceDomain ?? '',
    halalStatus: initialData?.halalStatus ?? 'needs_review',
    featured: initialData?.featured ?? false,
    qualityScore: initialData?.qualityScore ?? '5',
    valueScore: initialData?.valueScore ?? '5',
    tags: initialData?.tags ?? '',
  });

  // Validation
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  useEffect(() => {
    adminFetch('/api/admin/categories')
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data?.categories ?? data?.items ?? [];
        setCategories(arr);
      })
      .catch(() => setError('Impossible de charger les catégories'));
  }, []);

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugManual ? prev.slug : slugify(value),
    }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Le nom doit faire au moins 2 caractères';
    if (!form.slug.trim() || form.slug.trim().length < 2) e.slug = 'Le slug est requis (min 2 caractères)';
    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Slug invalide (lettres minuscules, chiffres, tirets uniquement)';
    if (!form.description.trim() || form.description.trim().length < 10) e.description = 'La description doit faire au moins 10 caractères';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      e.price = 'Un prix valide est requis';
    }
    if (!form.affiliateUrl.trim()) {
      e.affiliateUrl = "L'URL affiliée est requise";
    } else if (!/^https?:\/\/.+/.test(form.affiliateUrl.trim())) {
      e.affiliateUrl = "L'URL doit commencer par http:// ou https://";
    }
    if (!form.categoryId) e.categoryId = 'La catégorie est requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    // Préparer les tags
    const tagsArray = form.tags
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    // shortDescription doit avoir min 5 chars
    const shortDesc = form.shortDescription?.trim()
      || form.description.slice(0, 120).trim();

    const body = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      shortDescription: shortDesc.length >= 5 ? shortDesc : shortDesc + ' —',
      categoryId: form.categoryId,
      imageUrl: form.imageUrl || 'https://placehold.co/400x400?text=No+Image',
      price: Number(form.price),
      currency: form.currency,
      affiliateUrl: form.affiliateUrl,
      sourceName: form.sourceName || 'Inconnu',
      sourceDomain: form.sourceDomain || 'unknown.com',
      halalStatus: form.halalStatus,
      featured: form.featured,
      qualityScore: Number(form.qualityScore) || 5,
      valueScore: Number(form.valueScore) || 5,
      tags: tagsArray,
      isAvailable: true,
    };

    try {
      const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${productId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        setError('Non autorisé. Vérifiez votre token admin.');
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.error ?? err?.message ?? `Erreur ${res.status}`);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 1000);
    } catch {
      setError('Erreur réseau lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  }

  function Field({
    label,
    name,
    required,
    children,
  }: {
    label: string;
    name: keyof ProductFormData;
    required?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {errors[name] && (
          <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
        )}
      </div>
    );
  }

  const inputCls = (name: keyof ProductFormData) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[name]
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 font-medium">
          {mode === 'create' ? 'Produit créé avec succès !' : 'Produit mis à jour !'} Redirection...
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Nom */}
        <div className="md:col-span-2">
          <Field label="Nom du produit" name="name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputCls('name')}
              placeholder="Ex: iPhone 15 Pro Max"
            />
          </Field>
        </div>

        {/* Slug */}
        <Field label="Slug (URL)" name="slug" required>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setSlugManual(true);
              setForm((prev) => ({ ...prev, slug: e.target.value }));
            }}
            className={inputCls('slug')}
            placeholder="iphone-15-pro-max"
          />
        </Field>

        {/* Catégorie */}
        <Field label="Catégorie" name="categoryId" required>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
            className={inputCls('categoryId')}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Description */}
        <div className="md:col-span-2">
          <Field label="Description" name="description" required>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={inputCls('description')}
              placeholder="Description détaillée du produit..."
            />
          </Field>
        </div>

        {/* Description courte */}
        <div className="md:col-span-2">
          <Field label="Description courte" name="shortDescription">
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
              className={inputCls('shortDescription')}
              placeholder="Résumé en une ligne (optionnel — auto-généré depuis la description)"
            />
          </Field>
        </div>

        {/* Prix */}
        <Field label="Prix" name="price" required>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            className={inputCls('price')}
            placeholder="49.99"
          />
        </Field>

        {/* Devise */}
        <Field label="Devise" name="currency">
          <select
            value={form.currency}
            onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
            className={inputCls('currency')}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        {/* URL affiliée */}
        <div className="md:col-span-2">
          <Field label="URL affiliée" name="affiliateUrl" required>
            <input
              type="url"
              value={form.affiliateUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, affiliateUrl: e.target.value }))}
              className={inputCls('affiliateUrl')}
              placeholder="https://..."
            />
          </Field>
        </div>

        {/* URL image */}
        <div className="md:col-span-2">
          <Field label="URL image" name="imageUrl">
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              className={inputCls('imageUrl')}
              placeholder="https://..."
            />
          </Field>
        </div>

        {/* Marchand */}
        <Field label="Marchand (nom)" name="sourceName">
          <input
            type="text"
            value={form.sourceName}
            onChange={(e) => setForm((prev) => ({ ...prev, sourceName: e.target.value }))}
            className={inputCls('sourceName')}
            placeholder="Amazon, Fnac, Cdiscount..."
          />
        </Field>

        <Field label="Domaine marchand" name="sourceDomain">
          <input
            type="text"
            value={form.sourceDomain}
            onChange={(e) => setForm((prev) => ({ ...prev, sourceDomain: e.target.value }))}
            className={inputCls('sourceDomain')}
            placeholder="amazon.fr"
          />
        </Field>

        {/* Statut halal */}
        <Field label="Statut Halal" name="halalStatus">
          <select
            value={form.halalStatus}
            onChange={(e) => setForm((prev) => ({ ...prev, halalStatus: e.target.value }))}
            className={inputCls('halalStatus')}
          >
            {HALAL_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Quality Score */}
        <Field label="Score qualité (0–10)" name="qualityScore">
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={form.qualityScore}
            onChange={(e) => setForm((prev) => ({ ...prev, qualityScore: e.target.value }))}
            className={inputCls('qualityScore')}
            placeholder="5"
          />
        </Field>

        {/* Value Score */}
        <Field label="Score valeur (0–10)" name="valueScore">
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={form.valueScore}
            onChange={(e) => setForm((prev) => ({ ...prev, valueScore: e.target.value }))}
            className={inputCls('valueScore')}
            placeholder="5"
          />
        </Field>

        {/* Tags */}
        <div className="md:col-span-2">
          <Field label="Tags (séparés par virgules)" name="tags">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
              className={inputCls('tags')}
              placeholder="halal, certifié, bio, import..."
            />
          </Field>
        </div>

        {/* Mis en avant */}
        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Produit mis en avant (featured)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={submitting || success}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {submitting && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          {mode === 'create' ? 'Créer le produit' : 'Enregistrer les modifications'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
