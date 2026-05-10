import type { Product } from '../../types';

/**
 * Converts the product's trendingScore (0–100) to a 0–1 normalized value.
 * The `geo` parameter is reserved for future geo-aware trend data integration
 * (e.g. Google Trends by region).
 */
export function scoreTrend(product: Product, _geo?: string): number {
  const ts = product.trendingScore ?? 0;
  return Math.min(1, Math.max(0, ts / 100));
}
