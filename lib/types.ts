/* ── Core domain types ───────────────────────────────────── */

export type BadgeVariant = 'trending' | 'top-value' | 'new' | 'exclusive' | 'promo';

export interface Badge {
  label: string;
  variant: BadgeVariant;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;       // emoji or icon key
  productCount: number;
}

export interface AffiliateSource {
  name: string;       // e.g. "Amazon", "Fnac"
  domain: string;
  logoUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  imageUrl: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency: string;         // "EUR"
  affiliateUrl: string;
  source: AffiliateSource;
  badges: Badge[];
  qualityScore: number;     // 1–10 internal score
  valueScore: number;       // 1–10 quality/price ratio
  trendingScore?: number;   // higher = more trending
  tags: string[];
  isAvailable: boolean;
  lastUpdated: string;      // ISO date
  featured?: boolean;
  /** Halal classification status — set by the engine */
  halalStatus?: 'allowed' | 'forbidden' | 'doubtful' | 'needs_review';
  /** Rejection reasons — set by the engine or manual correction */
  rejectionReasons?: string[];
}

/* ── Filter/sort types ───────────────────────────────────── */

export type SortOption = 'trending' | 'value' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterState {
  category?: string;
  sort: SortOption;
  priceMax?: number;
  badges?: BadgeVariant[];
}

/* ── Page props ──────────────────────────────────────────── */

export interface PageProps {
  params: { slug: string };
  searchParams?: Record<string, string | string[]>;
}
