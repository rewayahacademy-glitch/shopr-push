import type { Product } from '../../types';
import { MODESTY_KEYWORDS } from '../config';

export interface ModestyResult {
  status: 'forbidden' | 'needs_review' | 'allowed';
  score: number;   // 0–1
  reasons: string[];
}

export function assessModesty(product: Product): ModestyResult {
  const text = [
    product.name,
    product.description,
    product.shortDescription ?? '',
    ...product.tags,
  ].join(' ').toLowerCase();

  // Hard modesty violation from text signals
  const forbiddenMatch = MODESTY_KEYWORDS.forbidden.find((kw) => text.includes(kw));
  if (forbiddenMatch) {
    return {
      status: 'forbidden',
      score: 1,
      reasons: [`modesty_forbidden:${forbiddenMatch}`],
    };
  }

  // Soft signals — may be fine, but needs human judgement on imagery
  const reviewMatches = MODESTY_KEYWORDS.review.filter((kw) => text.includes(kw));
  if (reviewMatches.length > 0) {
    const score = Math.min(0.7, reviewMatches.length * 0.15);
    return {
      status: 'needs_review',
      score,
      reasons: reviewMatches.map((m) => `modesty_review:${m}`),
    };
  }

  return { status: 'allowed', score: 0, reasons: [] };
}
