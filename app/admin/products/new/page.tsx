'use client';

import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
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
          <h2 className="text-lg font-bold text-gray-900">Ajouter un produit</h2>
          <p className="text-sm text-gray-500">Remplissez le formulaire pour créer un nouveau produit</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
