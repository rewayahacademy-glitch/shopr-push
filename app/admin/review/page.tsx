'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/components/admin/useAdminFetch';
import StatusBadge from '@/components/admin/StatusBadge';

interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
  halalStatus: string;
  confidence?: number;
  confidenceScore?: number;
  totalScore?: number;
  qualityScore?: number;
  rejectionReasons?: string[];
  riskFlags?: string[];
  flags?: string[];
  reasons?: string[];
  riskScores?: Record<string, number>;
  imageUrl?: string;
  price?: number;
  currency?: string;
  // category peut être une string ou un objet
  category?: string | { name: string };
  categoryName?: string;
  affiliateUrl?: string;
}

interface DecisionState {
  [productId: string]: {
    comment: string;
    submitting: boolean;
    done?: 'approved' | 'rejected';
  };
}

export default function ReviewPage() {
  const [products, setProducts] = useState<ReviewProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<DecisionState>({});
  const [history, setHistory] = useState<unknown[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);

  async function loadQueue() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/admin/engine/review-queue');
      if (res.status === 401) {
        setError('Non autorisé. Vérifiez votre token admin.');
        return;
      }
      if (!res.ok) {
        setError(`Erreur ${res.status}`);
        return;
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.queue ?? data?.products ?? data?.items ?? [];
      setProducts(arr);
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const res = await adminFetch('/api/admin/engine/feedback');
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.feedback ?? data?.items ?? [];
        setHistory(arr);
      }
    } catch {
      console.error('Erreur chargement historique');
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadQueue();
  }, []);

  function setDecision(productId: string, field: string, value: unknown) {
    setDecisions((prev) => ({
      ...prev,
      [productId]: {
        ...{ comment: '', submitting: false },
        ...prev[productId],
        [field]: value,
      },
    }));
  }

  async function submitDecision(productId: string, decision: 'approved' | 'rejected') {
    const comment = decisions[productId]?.comment ?? '';
    setDecision(productId, 'submitting', true);
    setDecisionError(null);

    const correctedStatus = decision === 'approved' ? 'allowed' : 'forbidden';

    try {
      const res = await adminFetch('/api/admin/engine/feedback', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          correctedStatus,
          correctedBy: 'admin',
          notes: comment || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setDecisionError(err?.error ?? err?.message ?? 'Erreur lors de la soumission');
        setDecision(productId, 'submitting', false);
        return;
      }

      setDecision(productId, 'done', decision);
      setTimeout(() => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }, 1500);
    } catch {
      setDecisionError('Erreur réseau');
      setDecision(productId, 'submitting', false);
    }
  }

  function getScore(product: ReviewProduct): string {
    const score = product.confidence ?? product.confidenceScore ?? product.totalScore ?? product.qualityScore;
    if (score == null) return '—';
    // confidence est entre 0 et 1, qualityScore peut être entre 1 et 10
    const pct = score <= 1 ? Math.round(score * 100) : Math.round(score * 10);
    return pct + '%';
  }

  function getFlags(product: ReviewProduct): string[] {
    // riskScores → convertir les clés en flags si score > 0
    if (product.riskScores) {
      const flags = Object.entries(product.riskScores)
        .filter(([, v]) => v > 0)
        .map(([k]) => k.replace(/_/g, ' '));
      if (flags.length > 0) return flags;
    }
    return product.riskFlags ?? product.flags ?? product.rejectionReasons ?? product.reasons ?? [];
  }

  function getCategoryName(product: ReviewProduct): string | null {
    if (!product.category) return null;
    if (typeof product.category === 'string') return product.category;
    return product.category.name;
  }

  function formatPrice(price?: number, currency?: string) {
    if (price == null) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(price);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Queue de révision Halal</h2>
          <p className="text-sm text-gray-500">
            {loading ? '...' : `${products.length} produit${products.length !== 1 ? 's' : ''} en attente de décision`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowHistory(!showHistory);
              if (!showHistory && history.length === 0) loadHistory();
            }}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {showHistory ? 'Masquer' : 'Voir'} l&apos;historique
          </button>
          <button
            onClick={loadQueue}
            className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            ↻ Actualiser
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {decisionError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {decisionError}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <span className="ml-3 text-gray-500">Chargement de la queue...</span>
        </div>
      )}

      {/* Queue vide */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16">
          <span className="text-4xl mb-3">✓</span>
          <p className="font-semibold text-gray-700">Queue vide !</p>
          <p className="mt-1 text-sm text-gray-400">Tous les produits ont été traités.</p>
        </div>
      )}

      {/* Produits à réviser */}
      {!loading && products.length > 0 && (
        <div className="space-y-4">
          {products.map((product) => {
            const state = decisions[product.id];
            const isDone = !!state?.done;
            const flags = getFlags(product);

            return (
              <div
                key={product.id}
                className={`rounded-2xl border bg-white shadow-sm transition-all ${
                  isDone
                    ? state?.done === 'approved'
                      ? 'border-green-200 opacity-60'
                      : 'border-red-200 opacity-60'
                    : 'border-gray-100 hover:border-indigo-100'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="h-16 w-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Nom + badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <StatusBadge status={product.halalStatus} />
                            {getCategoryName(product) && (
                              <span className="text-xs text-gray-500">{getCategoryName(product)}</span>
                            )}
                            {product.price != null && (
                              <span className="text-xs font-medium text-gray-700">
                                {formatPrice(product.price, product.currency)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-right">
                          <p className="text-xs text-gray-400">Score</p>
                          <p className="text-xl font-bold text-indigo-600">{getScore(product)}</p>
                        </div>
                      </div>

                      {/* Flags de risque */}
                      {flags.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Flags de risque :</p>
                          <div className="flex flex-wrap gap-1.5">
                            {flags.map((flag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-medium text-orange-700"
                              >
                                ⚠ {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isDone ? (
                    <div
                      className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold text-center ${
                        state?.done === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {state?.done === 'approved' ? '✓ Approuvé' : '✗ Rejeté'} — en cours de mise à jour...
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <textarea
                        value={state?.comment ?? ''}
                        onChange={(e) => setDecision(product.id, 'comment', e.target.value)}
                        placeholder="Commentaire (optionnel)..."
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => submitDecision(product.id, 'approved')}
                          disabled={state?.submitting}
                          className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
                        >
                          {state?.submitting ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            '✓'
                          )}
                          Approuver
                        </button>
                        <button
                          onClick={() => submitDecision(product.id, 'rejected')}
                          disabled={state?.submitting}
                          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
                        >
                          ✗ Rejeter
                        </button>
                        <a
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Voir le produit ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Historique */}
      {showHistory && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="font-semibold text-gray-900">Historique des décisions</h3>
          </div>
          {historyLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
              <span className="ml-3 text-sm text-gray-500">Chargement...</span>
            </div>
          ) : history.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">Aucun historique disponible</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {(history as Array<Record<string, unknown>>).map((item, i) => (
                <div key={(item as Record<string, unknown>).id as string ?? i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {String(item.productName ?? item.productId ?? '—')}
                    </p>
                    {typeof item.comment === 'string' && item.comment && (
                      <p className="text-xs text-gray-400">{item.comment}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={String(item.decision ?? item.status ?? '')} />
                    <span className="text-xs text-gray-400">
                      {item.createdAt
                        ? new Date(String(item.createdAt)).toLocaleDateString('fr-FR')
                        : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
