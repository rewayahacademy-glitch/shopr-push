'use client';

import { useState, useEffect, useCallback } from 'react';

const ADMIN_TOKEN = 'shopr_admin_OWVkMWFkNDgtMmQzYy00MjNk';

export function getAdminToken(): string {
  if (typeof window === 'undefined') return ADMIN_TOKEN;
  return localStorage.getItem('admin_token') ?? '';
}

export function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

export function useAdminFetch<T>(url: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch(url);
      if (res.status === 401) {
        setError('Non autorisé — vérifiez votre token admin');
        return;
      }
      if (!res.ok) {
        setError(`Erreur ${res.status}`);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
