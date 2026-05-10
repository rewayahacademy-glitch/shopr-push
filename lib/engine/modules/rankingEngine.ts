import type { Product } from '../../types';
import type { ProductScore } from '../types';
import { SCORE_WEIGHTS } from '../config';
import { hasValidAffiliateLink } from './affiliateValidation';
import { classifyHalal } from './halalPolicyEngine';
import { scoreQualityPrice } from './qualityPriceScoring';
import { scoreMerchantTrust } from './merchantTrustScoring';
import { scoreTrend } from './trendScoring';
import { scoreSeasonality } from './seasonalityScoring';

export function computeScore(product: Product, geo?: string): ProductScore {
  const affiliateScore = hasValidAffiliateLink(product) ? 1 : 0;

  const halalStatus = classifyHalal(product);
  const complianceScore =
    halalStatus === 'allowed' ? 1 : halalStatus === 'doubtful' ? 0.3 : 0;

  const qualityPriceScore  = scoreQualityPrice(product);
  const merchantTrustScore = scoreMerchantTrust(product);
  const trendScore         = scoreTrend(product, geo);
  const seasonalScore      = scoreSeasonality(product);

  const totalScore =
    affiliateScore    * SCORE_WEIGHTS.affiliate     +
    complianceScore   * SCORE_WEIGHTS.compliance    +
    qualityPriceScore * SCORE_WEIGHTS.qualityPrice  +
    merchantTrustScore * SCORE_WEIGHTS.merchantTrust +
    trendScore        * SCORE_WEIGHTS.trend         +
    seasonalScore     * SCORE_WEIGHTS.seasonal;

  return {
    productId: product.id,
    affiliateScore,
    complianceScore,
    qualityPriceScore,
    merchantTrustScore,
    trendScore,
    seasonalScore,
    totalScore,
  };
}

export function rankProducts(
  products: Product[],
  geo?: string,
): { ranked: Product[]; scores: ProductScore[] } {
  const scores = products.map((p) => computeScore(p, geo));
  const scoreMap = new Map(scores.map((s) => [s.productId, s.totalScore]));

  const ranked = [...products].sort(
    (a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0),
  );

  return { ranked, scores };
}
