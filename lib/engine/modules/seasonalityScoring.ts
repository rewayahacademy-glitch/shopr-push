import type { Product } from '../../types';
import { SEASONAL_EVENTS } from '../config';

export function scoreSeasonality(product: Product): number {
  const now = new Date();
  const month = now.getMonth() + 1; // 1–12
  const productText = [product.name, product.description, ...product.tags]
    .join(' ')
    .toLowerCase();

  let bestWeight = 1.0;

  for (const event of SEASONAL_EVENTS) {
    const isActive =
      event.monthStart <= event.monthEnd
        ? month >= event.monthStart && month <= event.monthEnd
        : month >= event.monthStart || month <= event.monthEnd; // wraps year-end

    if (!isActive) continue;

    const matches = event.tags.some((t) => productText.includes(t));
    if (matches && event.weight > bestWeight) {
      bestWeight = event.weight;
    }
  }

  /* Normalize: weight 1.0 → score 0.5 (neutral), weight 1.4 → score 1.0 */
  return Math.min(1, (bestWeight - 1) / 0.4 * 0.5 + 0.5);
}
