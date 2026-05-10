'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminFetch } from '@/components/admin/useAdminFetch';

const ADMIN_TOKEN_KEY = 'admin_token';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/products', label: 'Produits', icon: '◈' },
  { href: '/admin/categories', label: 'Catégories', icon: '◉' },
  { href: '/admin/review', label: 'Revue Halal', icon: '✦' },
  { href: '/admin/analytics', label: 'Analytics', icon: '◎' },
  { href: '/admin/logs', label: 'Logs', icon: '◇' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [rescoring, setRescoring] = useState(false);
  const [rescoredMsg, setRescoredMsg] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // Re-lit localStorage à chaque changement de page (important: le layout persiste
  // entre navigations, donc on ne peut pas dépendre d'un useEffect monté une seule fois)
  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_TOKEN_KEY);
    setToken(saved ?? null);
    setMounted(true);
  }, [pathname]);

  // Redirige vers login si pas de token (sauf sur la page login elle-même)
  useEffect(() => {
    if (!mounted) return;
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [mounted, token, pathname, router]);

  useEffect(() => {
    if (!token) return;
    adminFetch('/api/admin/engine/review-queue')
      .then((r) => r.json())
      .then((d) => {
        if (d?.count != null) {
          setReviewCount(d.count);
        } else {
          const items = Array.isArray(d) ? d : d?.queue ?? d?.products ?? d?.items ?? [];
          setReviewCount(items.length);
        }
      })
      .catch(() => {});
  }, [token]);

  async function handleLogout() {
    await fetch('/api/admin/session', { method: 'DELETE' });
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    router.push('/admin/login');
  }

  async function handleRescore() {
    setRescoring(true);
    setRescoredMsg('');
    try {
      const res = await adminFetch('/api/engine/score', { method: 'POST' });
      if (res.ok) {
        setRescoredMsg('Rescoring terminé !');
      } else {
        setRescoredMsg('Erreur lors du rescoring');
      }
    } catch {
      setRescoredMsg('Erreur réseau');
    } finally {
      setRescoring(false);
      setTimeout(() => setRescoredMsg(''), 4000);
    }
  }

  const isLoginPage = pathname === '/admin/login';

  if (!mounted || (!token && !isLoginPage)) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-indigo-700 text-white shadow-xl">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-indigo-600/50 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-bold">
            S
          </div>
          <span className="text-base font-bold tracking-wide">SHOPR Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
                {link.href === '/admin/review' && reviewCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-yellow-400 px-1.5 text-xs font-bold text-yellow-900">
                    {reviewCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-indigo-600/50 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-indigo-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            ← Déconnexion
          </button>
        </div>
      </aside>

      {/* Main area (right of sidebar) */}
      <div className="absolute inset-0 left-60 flex flex-col">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {navLinks.find((l) =>
                l.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(l.href)
              )?.label ?? 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {rescoredMsg && (
              <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200">
                {rescoredMsg}
              </span>
            )}
            <button
              onClick={handleRescore}
              disabled={rescoring}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {rescoring ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Rescoring...
                </>
              ) : (
                '↻ Rescorer'
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
