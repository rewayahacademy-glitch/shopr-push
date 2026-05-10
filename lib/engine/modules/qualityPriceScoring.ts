import type { Product } from '../../types';

export function scoreQualityPrice(product: Product): number {
  const qs = product.qualityScore ?? 0;  // 1–10
  const vs = product.valueScore ?? 0;    // 1–10

  const base = ((qs + vs) / 2) / 10;    // 0–1

  /* Discount bonus: genuine reduction increases the score */
  let discountBonus = 0;
  if (product.originalPrice && product.originalPrice > product.price) {
    const rate = (product.originalPrice - product.price) / product.originalPrice;
    discountBonus = Math.min(rate * 0.4, 0.25); // capped at +0.25
  }

  return Math.min(1, base + discountBonus);
}
