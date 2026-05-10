import type { Product } from '../../types';
import { SPIRITUAL_KEYWORDS, YOGA_KEYWORDS } from '../config';

export interface SpiritualRiskResult {
  status: 'forbidden' | 'needs_review' | 'allowed';
  score: number;   // 0–1, higher = more risky
  reasons: string[];
}

export function assessSpiritualRisk(product: Product): SpiritualRiskResult {
  const text = [
    product.name,
    product.description,
    product.shortDescription ?? '',
    product.categorySlug ?? '',
    product.categoryName ?? '',
    ...product.tags,
  ].join(' ').toLowerCase();

  // Hard forbidden spiritual items
  const forbiddenMatch = SPIRITUAL_KEYWORDS.forbidden.find((kw) => text.includes(kw));
  if (forbiddenMatch) {
    return {
      status: 'forbidden',
      score: 1,
      reasons: [`spiritual_forbidden:${forbiddenMatch}`],
    };
  }

  // Yoga: spiritual framing = forbidden; physical-only = allowed; mixed = review
  const isYogaSpiritual = YOGA_KEYWORDS.spiritual.some((kw) => text.includes(kw));
  const isYogaPhysical  = YOGA_KEYWORDS.physical.some((kw) => text.includes(kw));

  if (isYogaSpiritual) {
    if (!isYogaPhysical) {
      return {
        status: 'forbidden',
        score: 0.9,
        reasons: ['yoga_spiritual_framing'],
      };
    }
    // Mixed signals — route to review
    return {
      status: 'needs_review',
      score: 0.6,
      reasons: ['yoga_mixed_signals'],
    };
  }

  // Soft spiritual signals — needs human review
  const reviewMatches = SPIRITUAL_KEYWORDS.review.filter((kw) => text.includes(kw));
  if (reviewMatches.length > 0) {
    const score = Math.min(0.75, reviewMatches.length * 0.15);
    return {
      status: 'needs_review',
      score,
      reasons: reviewMatches.map((m) => `spiritual_review:${m}`),
    };
  }

  return { status: 'allowed', score: 0, reasons: [] };
}
