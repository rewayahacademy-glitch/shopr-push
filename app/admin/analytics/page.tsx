'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import { adminFetch } from '@/components/admin/useAdminFetch';

interface Overview {
  totalProducts?: number;
  availableProducts?: number;
  unavailableProducts?: number;
  featuredCount?: number;
  pendingReview?: number;
  totalCategories?: number;
  totalClicks?: number;
  clicksInPeriod?: number;
  periodDays?: number;
}

interface HalalBreakdown {
  allowed?: number;
  review?: number;
  rejected?: number;
  needs_review?: number;
  [key: string]: number | undefined;
}

interface AnalyticsData {
  overview?: Overview;
  halalBreakdown?: HalalBreakdown;
  topProducts?: ProductClick[];
  productClicks?: ProductClick[];
  clicksByDay?: DayClick[];
  // Fallback flat structure
  totalProducts?: number;
  approvedProducts?: number;
  reviewProducts?: number;
  rejectedProducts?: number;
  totalClicks?: number;
  clicksThisWeek?: number;
  clicksToday?: number;
  [key: string]: unknown;
}

interface ProductClick {
  id?: string;
  productId?: string;
  name?: string;
  productName?: string;
  clicks?: number;
  clickCount?: number;
  _count?: { id: number };
  slug?: string;
}

interface DayClick {
  date?: string;
  day?: string;
  clicks?: number;
  count?: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await adminFetch('/api/admin/analytics');
        if (res.status === 401) {
          setError('Non autorisé. Vérifiez votre token admin.');
          return;
        }
        if (!res.ok) {
          setError(`Erreur ${res.status}`);
          return;
        }
        setData(await res.json());
      } catch {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <span className="ml-4 text-gray-500">Chargement des analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700">
        <p className="font-semibold">Erreur</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  // Extraire les données (support API imbriquée ou plate)
  const overview = data?.overview;
  const halalBreakdown = data?.halalBreakdown ?? {};
  const total = overview?.totalProducts ?? data?.totalProducts ?? 0;
  const approved = halalBreakdown['allowed'] ?? data?.approvedProducts ?? 0;
  const inReview = ((halalBreakdown['needs_review'] ?? 0) + (halalBreakdown['doubtful'] ?? 0) + (halalBreakdown['review'] ?? 0)) || (overview?.pendingReview ?? data?.reviewProducts ?? 0);
  const rejected = halalBreakdown['forbidden'] ?? halalBreakdown['rejected'] ?? data?.rejectedProducts ?? 0;
  const totalClicks = overview?.totalClicks ?? data?.totalClicks ?? 0;
  const clicksInPeriod = overview?.clicksInPeriod ?? data?.clicksThisWeek ?? 0;
  const periodDays = overview?.periodDays ?? 30;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Produits les plus cliqués
  const topProducts: ProductClick[] = data?.topProducts ?? data?.productClicks ?? [];

  // Clics par jour
  const clicksByDay: DayClick[] = data?.clicksByDay ?? [];

  function getProductName(p: ProductClick): string {
    return p.name ?? p.productName ?? p.productId ?? p.id ?? '—';
  }

  function getClickCount(p: ProductClick): number {
    return p.clicks ?? p.clickCount ?? p._count?.id ?? 0;
  }

  function getDayLabel(d: DayClick): string {
    const raw = d.date ?? d.day ?? '';
    if (!raw) return '—';
    try {
      return new Date(raw).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    } catch {
      return raw;
    }
  }

  function getDayCount(d: DayClick): number {
    return d.clicks ?? d.count ?? 0;
  }

  const maxClicks = topProducts.length > 0
    ? Math.max(...topProducts.map(getClickCount))
    : 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500">Vue d&apos;ensemble des performances de la plateforme</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Produits" value={total} icon="◈" color="indigo" />
        <StatCard title="Approuvés" value={approved} icon="✓" color="green" subtitle={`${approvalRate}% du total`} />
        <StatCard title="En révision" value={inReview} icon="◎" color="yellow" />
        <StatCard title="Rejetés" value={rejected} icon="✗" color="red" />
      </div>

      {/* Stats clics */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Clics totaux" value={totalClicks} icon="↗" color="blue" />
        <StatCard title={`Clics (${periodDays}j)`} value={clicksInPeriod} icon="◇" color="indigo" />
        <StatCard title="Catégories" value={overview?.totalCategories ?? 0} icon="◉" color="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top produits par clics */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="font-semibold text-gray-900">Top produits par clics</h3>
          </div>
          {topProducts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">Aucune donnée disponible</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {topProducts.slice(0, 10).map((product, i) => {
                const clicks = getClickCount(product);
                const pct = maxClicks > 0 ? (clicks / maxClicks) * 100 : 0;
                return (
                  <div key={product.id ?? product.productId ?? i} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                        <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                          {getProductName(product)}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-indigo-600">{clicks}</span>
                    </div>
                    <div className="ml-7 h-1.5 w-full rounded-full bg-gray-100">
                      <div
                        className="h-1.5 rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clics par jour */}
        {clicksByDay.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-gray-900">Clics par jour</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {clicksByDay.slice(0, 10).map((day, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-600">{getDayLabel(day)}</span>
                  <span className="text-sm font-semibold text-indigo-600">{getDayCount(day)} clics</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Autres données brutes si disponibles */}
        {data && clicksByDay.length === 0 && topProducts.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-gray-900">Données analytics brutes</h3>
            </div>
            <div className="p-5">
              <pre className="text-xs text-gray-600 overflow-auto max-h-64 rounded-lg bg-gray-50 p-4">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
