/**
 * MOCK DATA — replace with real affiliate feed integration.
 * All products, prices, and URLs are placeholders.
 */
import type { Category, Product } from './types';

export const categories: Category[] = [
  {
    id: 'cat-tech',
    slug: 'tech',
    name: 'Tech & High-Tech',
    description: 'Smartphones, laptops, accessoires audio et gadgets sélectionnés.',
    icon: '⚡',
    productCount: 0,
  },
  {
    id: 'cat-mode',
    slug: 'mode',
    name: 'Mode & Style',
    description: 'Pièces intemporelles et tendances saisonnières à prix intelligent.',
    icon: '✦',
    productCount: 0,
  },
  {
    id: 'cat-maison',
    slug: 'maison',
    name: 'Maison & Déco',
    description: 'Mobilier, luminaires et objets déco pour intérieurs soignés.',
    icon: '◈',
    productCount: 0,
  },
  {
    id: 'cat-sport',
    slug: 'sport',
    name: 'Sport & Bien-être',
    description: 'Équipements, nutrition et accessoires bien-être validés.',
    icon: '◎',
    productCount: 0,
  },
  {
    id: 'cat-voyage',
    slug: 'voyage',
    name: 'Voyage & Loisirs',
    description: 'Bagages, accessoires voyage et expériences à saisir.',
    icon: '◇',
    productCount: 0,
  },
  {
    id: 'cat-cuisine',
    slug: 'cuisine',
    name: 'Cuisine & Épicerie fine',
    description: 'Ustensiles, machines et produits pour cuisiniers exigeants.',
    icon: '◉',
    productCount: 0,
  },
];

export const products: Product[] = [
  /* ── Featured / Hero ──────────────────────────────────── */
  {
    id: 'prod-001',
    slug: 'casque-audio-premium',
    name: 'Casque Audio Premium',
    description:
      'Placeholder — remplacer par la description réelle du produit affilié. Qualité audio exceptionnelle, réduction de bruit active, 30h d\'autonomie.',
    shortDescription: 'Réduction de bruit active · 30h autonomie · Codec aptX HD',
    categoryId: 'cat-tech',
    categorySlug: 'tech',
    categoryName: 'Tech & High-Tech',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    price: 249,
    originalPrice: 349,
    currency: 'EUR',
    affiliateUrl: '#affiliate-link-placeholder',
    source: { name: 'Amazon', domain: 'amazon.fr' },
    badges: [
      { label: 'Tendance', variant: 'trending' },
      { label: 'Top rapport Q/P', variant: 'top-value' },
    ],
    qualityScore: 9,
    valueScore: 9,
    trendingScore: 95,
    tags: ['audio', 'sans-fil', 'nomade'],
    isAvailable: true,
    lastUpdated: '2026-05-09',
    featured: true,
  },
  {
    id: 'prod-002',
    slug: 'montre-connectee-sport',
    name: 'Montre Connectée Sport',
    description:
      'Placeholder — GPS intégré, suivi santé avancé, étanchéité 5 ATM. Design sobre et premium.',
    shortDescription: 'GPS · Suivi santé · 14 jours autonomie',
    categoryId: 'cat-tech',
    categorySlug: 'tech',
    categoryName: 'Tech & High-Tech',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    price: 199,
    originalPrice: 279,
    currency: 'EUR',
    affiliateUrl: '#affiliate-link-placeholder',
    source: { name: 'Amazon', domain: 'amazon.fr' },
    badges: [{ label: 'Promo', variant: 'promo' }],
    qualityScore: 8,
    valueScore: 9,
    trendingScore: 82,
    tags: ['sport', 'santé', 'connecté'],
    isAvailable: true,
    lastUpdated: '2026-05-09',
    featured: true,
  },
  {
    id: 'prod-003',
    slug: 'veste-mi-saison',
    name: 'Veste Mi-Saison Premium',
    description:
      'Placeholder — coupe structurée, matière technique déperlante, fabrication éco-responsable.',
    shortDescription: 'Coupe structurée · Déperlant · Éco-responsable',
    categoryId: 'cat-mode',
    categorySlug: 'mode',
    categoryName: 'Mode & Style',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    price: 139,
    originalPrice: 189,
    currency: 'EUR',
    affiliateUrl: '#affiliate-link-placeholder',
    source: { name: 'Amazon', domain: 'amazon.fr' },
    badges: [{ label: 'Nouveau', variant: 'new' }],
    qualityScore: 8,
    valueScore: 8,
    trendingScore: 70,
    tags: ['mode', 'veste', 'éco'],
    isAvailable: true,
    lastUpdated: '2026-05-08',
    featured: true,
  },
  {
    id: 'prod-004',
    slug: 'lampe-architecte',
    name: 'Lampe Architecte Design',
    description:
      'Placeholder — bras articulé, lumière froide/chaude, variateur intégré. Fabrication européenne.',
    shortDescription: 'LED 3 températures · Bras articulé · 15W',
    categoryId: 'cat-maison',
    categorySlug: 'maison',
    categoryName: 'Maison & Déco',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    price: 89,
    currency: 'EUR',
    affiliateUrl: '#affiliate-link-placeholder',
    source: { name: 'Amazon', domain: 'amazon.fr' },
    badges: [{ label: 'Top rapport Q/P', variant: 'top-value' }],
    qualityScore: 8,
    valueScore: 10,
    trendingScore: 65,
    tags: ['déco', 'bureau', 'lumière'],
    isAvailable: true,
    lastUpdated: '2026-05-07',
    featured: false,
  },
  {
    id: 'prod-005',
    slug: 'tapis-yoga-pro',
    name: 'Tapis de Yoga Professionnel',
    description:
      'Placeholder — épaisseur 6mm, grip naturel, matière recyclée, sangle incluse.',
    shortDescription: '6mm · Grip naturel · Matière recyclée',
    categoryId: 'cat-sport',
    categorySlug: 'sport',
    categoryName: 'Sport & Bien-être',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    price: 59,
    originalPrice: 79,
    currency: 'EUR',
    affiliateUrl: '#affiliate-link-placeholder',
    source: { name: 'Amazon', domain: 'amazon.fr' },
    badges: [
      { label: 'Tendance', variant: 'trending' },
    ],
    qualityScore: 9,
    valueScore: 9,
    trendingScore: 88,
    tags: ['yoga', 'bien-être', 'sport'],
    isAvailable: true,
    lastUpdated: '2026-05-09',
    featured: false,
  },
  {
    id: 'prod-006',
    slug: 'cafetiere-pour-over',
    name: 'Cafetière Pour-Over Signature',
    description:
      'Placeholder — verre borosilicate, filtre réutilisable, capacité 600ml. Pour une extraction parfaite.',
    shortDescription: 'Verre borosilicate · Filtre réutilisable · 600ml',
    categoryId: 'cat-cuisine',
    categorySlug: 'cuisine',
    categoryName: 'Cuisine & Épicerie fine',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    price: 44,
    currency: 'EUR',
    affiliateUrl: '#affiliate-link-placeholder',
    source: { name: 'Amazon', domain: 'amazon.fr' },
    badges: [{ label: 'Exclusif', variant: 'exclusive' }],
    qualityScore: 9,
    valueScore: 10,
    trendingScore: 72,
    tags: ['café', 'cuisine', 'lifestyle'],
    isAvailable: true,
    lastUpdated: '2026-05-06',
    featured: false,
  },
];

/* Augment categories with real product counts */
categories.forEach((cat) => {
  cat.productCount = products.filter((p) => p.categoryId === cat.id).length;
});

export const featuredProducts = products.filter((p) => p.featured);
export const trendingProducts = [...products].sort(
  (a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0),
);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
