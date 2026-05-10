import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Category } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getLayoutCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: {
    default: 'SHOPR — Shopping intelligent, sélection premium',
    template: '%s · SHOPR',
  },
  description:
    'SHOPR sélectionne rigoureusement les meilleurs produits selon leurs critères qualité, fiabilité et rapport qualité/prix. Moins de produits, mieux choisis.',
  keywords: ['affiliation', 'shopping', 'sélection', 'qualité', 'tendances', 'bons plans'],
  authors: [{ name: 'SHOPR' }],
  creator: 'SHOPR',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'SHOPR',
    title: 'SHOPR — Shopping intelligent, sélection premium',
    description: 'Moins de produits, mieux choisis.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHOPR',
    description: 'Shopping intelligent. Sélection premium.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#035058',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getLayoutCategories();

  return (
    <html lang="fr" className="scroll-smooth">
      <body className="font-outfit bg-bg text-slate antialiased">
        <Header categories={categories} />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer categories={categories} />
      </body>
    </html>
  );
}
