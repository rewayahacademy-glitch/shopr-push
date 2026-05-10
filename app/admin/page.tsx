'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';
import { adminFetch } from '@/components/admin/useAdminFetch';

interface Analytics {
  // Structure plate (fallback)
  totalProducts?: number;
  approvedProducts?: number;
  reviewProducts?: number;
  rejectedProducts?: number;
  totalClicks?: number;
  clicksThisWeek?: number;
  // Structure API réelle
  overview?: {
    totalProducts?: number;
    availableProducts?: number;
    featuredCount?: number;
    pendingReview?: number;
    totalCategories?: number;
    totalClicks?: number;
    clicksInPeriod?: number;
    periodDays?: number;
  };
  halalBreakdown?: Record<string, number>;
  topProducts?: unknown[];
  clicksByDay?: unknown[];
  [key: string]: unknown;
}

interface LogEntry {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  payload?: unknown;
  ipAddress?: string;
  createdAt: string;
  product?: { name: string } | null;
  category?: { name: string } | null;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [analyticsRes, logsRes, reviewRes] = await Promise.all([
          adminFetch('/api/admin/analytics'),
          adminFetch('/api/admin/logs'),
          adminFetch('/api/admin/engine/review-queue'),
        ]);

        if (analyticsRes.status === 401) {
          setError('Non autorisé. Vérifiez votre token admin.');
          return;
        }

        const analyticsData = analyticsRes.ok ? await analyticsRes.json() : {};
        const logsData = logsRes.ok ? await logsRes.json() : [];
        const reviewData = reviewRes.ok ? await reviewRes.json() : [];

        setAnalytics(analyticsData);

        // API paginate retourne { data: [...], ... }
        const logsArray = Array.isArray(logsData)
          ? logsData
          : logsData?.data ?? logsData?.logs ?? logsData?.items ?? [];
        setLogs(logsArray.slice(0, 5));

        // review-queue retourne { queue: [...], count: N }
        const reviewArray = Array.isArray(reviewData)
          ? reviewData
          : reviewData?.queue ?? reviewData?.products ?? reviewData?.items ?? [];
        setReviewCount(reviewData?.count ?? reviewArray.length);
      } catch {
        setError('Erreur réseau lors du chargement des données');
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
        <span className="ml-4 text-gray-500">Chargement du tableau de bord...</span>
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

  // L'API analytics retourne { overview: {...}, halalBreakdown: {...}, topProducts, clicksByDay }
  const overview = analytics?.overview as Record<string, number> | undefined;
  const halalBreakdown = analytics?.halalBreakdown as Record<string, number> | undefined;

  const stats = [
    {
      title: 'Total Produits',
      value: overview?.totalProducts ?? analytics?.totalProducts ?? 0,
      icon: '◈',
      color: 'indigo' as const,
    },
    {
      title: 'Approuvés',
      value: halalBreakdown?.['allowed'] ?? analytics?.approvedProducts ?? 0,
      icon: '✓',
      color: 'green' as const,
    },
    {
      title: 'En révision',
      value: ((halalBreakdown?.['needs_review'] ?? 0) + (halalBreakdown?.['doubtful'] ?? 0)) || (overview?.pendingReview ?? reviewCount),
      icon: '◎',
      color: 'yellow' as const,
    },
    {
      title: 'Rejetés',
      value: halalBreakdown?.['forbidden'] ?? analytics?.rejectedProducts ?? 0,
      icon: '✗',
      color: 'red' as const,
    },
  ];

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Review queue alert */}
      {reviewCount > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠</span>
            <div>
              <p className="font-semibold text-yellow-800">
                {reviewCount} produit{reviewCount > 1 ? 's' : ''} en attente de révision halal
              </p>
              <p className="text-sm text-yellow-700">Ces produits nécessitent une décision manuelle</p>
            </div>
          </div>
          <Link
            href="/admin/review"
            className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 transition-colors"
          >
            Réviser maintenant →
          </Link>
        </div>
      )}

      {/* Analytics supplémentaires */}
      {analytics && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Clics totaux</p>
            <p className="mt-1 text-2xl font-bold text-indigo-700">{overview?.totalClicks ?? analytics.totalClicks ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Clics (30 derniers jours)</p>
            <p className="mt-1 text-2xl font-bold text-indigo-700">{overview?.clicksInPeriod ?? analytics.clicksThisWeek ?? 0}</p>
          </div>
        </div>
      )}

      {/* Derniers logs */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Derniers logs système</h2>
          <Link href="/admin/logs" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Voir tous →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {logs.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-400 text-center">Aucun log disponible</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                    {log.entity?.[0]?.toUpperCase() ?? '?'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {log.action}
                      {log.product?.name && (
                        <span className="ml-1 text-gray-500">— {log.product.name}</span>
                      )}
                      {log.category?.name && (
                        <span className="ml-1 text-gray-500">— {log.category.name}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{log.entity}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <span className="text-lg">+</span> Ajouter un produit
        </Link>
        <Link
          href="/admin/categories"
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="text-lg">◉</span> Gérer catégories
        </Link>
        <Link
          href="/admin/analytics"
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="text-lg">◎</span> Voir analytics
        </Link>
      </div>
    </div>
  );
}
