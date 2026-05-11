'use client';

import { useEffect, useState, Fragment } from 'react';
import { adminFetch } from '@/components/admin/useAdminFetch';

interface LogEntry {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  productId?: string;
  categoryId?: string;
  product?: { id: string; name: string; slug: string } | null;
  category?: { id: string; name: string } | null;
  payload?: unknown;
  ipAddress?: string;
  createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  approve: 'bg-green-100 text-green-700',
  reject: 'bg-red-100 text-red-700',
  score: 'bg-indigo-100 text-indigo-700',
  feedback: 'bg-yellow-100 text-yellow-700',
  rescore: 'bg-purple-100 text-purple-700',
};

function getActionColor(action: string): string {
  const key = Object.keys(ACTION_COLORS).find((k) => action.toLowerCase().includes(k));
  return key ? ACTION_COLORS[key] : 'bg-gray-100 text-gray-600';
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 30;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await adminFetch('/api/admin/logs');
        if (res.status === 401) {
          setError('Non autorisé. Vérifiez votre token admin.');
          return;
        }
        if (!res.ok) {
          setError(`Erreur ${res.status}`);
          return;
        }
        const data = await res.json();
        // API paginate retourne { data: [...], nextCursor, hasMore, count }
        const arr = Array.isArray(data) ? data : data?.data ?? data?.logs ?? data?.items ?? [];
        setLogs(arr);
      } catch {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  const paginated = logs.slice(0, page * PAGE_SIZE);
  const hasMore = logs.length > paginated.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Logs système</h2>
          <p className="text-sm text-gray-500">{logs.length} entrée{logs.length !== 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <span className="ml-3 text-gray-500">Chargement des logs...</span>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Entité</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Produit / Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                      Aucun log disponible
                    </td>
                  </tr>
                ) : (
                  paginated.map((log) => (
                    <Fragment key={log.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        {/* Action */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${getActionColor(log.action)}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        {/* Entité */}
                        <td className="px-4 py-3 text-gray-600 font-medium">{log.entity}</td>
                        {/* Produit/Catégorie */}
                        <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                          {log.product?.name ?? log.category?.name ?? log.entityId ?? '—'}
                        </td>
                        {/* IP */}
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">
                          {log.ipAddress ?? '—'}
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                        {/* Détails */}
                        <td className="px-4 py-3">
                          {!!log.payload && (
                            <button
                              onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                            >
                              {expanded === log.id ? 'Masquer' : 'Voir'}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expanded === log.id && log.payload && (
                        <tr key={`${log.id}-detail`} className="bg-gray-50">
                          <td colSpan={6} className="px-4 py-3">
                            <pre className="text-xs text-gray-600 overflow-auto max-h-40 rounded-lg bg-white border border-gray-100 p-3">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Charger plus ({logs.length - paginated.length} restant{logs.length - paginated.length > 1 ? 's' : ''})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
