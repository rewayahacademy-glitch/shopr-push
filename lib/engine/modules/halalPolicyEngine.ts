import type { Product } from '../../types';
import type { HalalStatus, ClassificationResult, RiskScores } from '../types';
import { HALAL_KEYWORDS, PROHIBITED_CATEGORIES } from '../config';
import { assessSpiritualRisk } from './spiritualRiskEngine';
import { assessModesty } from './modestyPolicyEngine';
import { assessFinanceRisk } from './ribaEngine';

/* Simple wrapper used by modules that only need the final status */
export function classifyHalal(product: Product): HalalStatus {
  return classifyHalalDetailed(product).halalStatus;
}

export function classifyHalalDetailed(product: Product): ClassificationResult {
  const text = [
    product.name,
    product.description,
    product.shortDescription ?? '',
    product.categorySlug ?? '',
    product.categoryName ?? '',
    ...product.tags,
  ].join(' ').toLowerCase();

  const reasons: string[] = [];

  // 1. Prohibited category — instant reject, confidence 1
  if (PROHIBITED_CATEGORIES.some((cat) => (product.categorySlug ?? '').includes(cat))) {
    return {
      halalStatus: 'forbidden',
      confidence: 1,
      reasons: ['prohibited_category'],
      riskScores: fullRisk(),
    };
  }

  // 2. Keyword-based halal detection
  const forbiddenKw = HALAL_KEYWORDS.forbidden.find((kw) => text.includes(kw));
  const doubtfulKw  = HALAL_KEYWORDS.doubtful.find((kw) => text.includes(kw));
  if (forbiddenKw) reasons.push(`haram_keyword:${forbiddenKw}`);
  if (doubtfulKw)  reasons.push(`doubtful_keyword:${doubtfulKw}`);

  const haramSubject = forbiddenKw ? 1 : doubtfulKw ? 0.5 : 0;

  // 3. Spiritual risk engine
  const spiritual = assessSpiritualRisk(product);
  reasons.push(...spiritual.reasons);

  // 4. Modesty policy engine
  const modesty = assessModesty(product);
  reasons.push(...modesty.reasons);

  // 5. Finance / riba engine
  const finance = assessFinanceRisk(product);
  reasons.push(...finance.reasons);

  const riskScores: RiskScores = {
    haramSubject,
    haramContext:  0,
    ribaScore:     finance.ribaDetected ? 1 : finance.gharar ? 0.5 : 0,
    gharar:        finance.gharar ? 1 : 0,
    maysir:        finance.maysir ? 1 : 0,
    fraud:         finance.fraud  ? 1 : 0,
    spiritualRisk: spiritual.score,
    modestyRisk:   modesty.score,
  };

  // 6. Decision matrix
  const hardFail =
    forbiddenKw ||
    spiritual.status === 'forbidden' ||
    modesty.status   === 'forbidden' ||
    finance.status   === 'forbidden';

  if (hardFail) {
    return { halalStatus: 'forbidden', confidence: 0.95, reasons, riskScores };
  }

  const needsReview =
    spiritual.status === 'needs_review' ||
    modesty.status   === 'needs_review' ||
    finance.status   === 'needs_review';

  if (needsReview) {
    return { halalStatus: 'needs_review', confidence: 0.6, reasons, riskScores };
  }

  if (doubtfulKw) {
    return { halalStatus: 'doubtful', confidence: 0.7, reasons, riskScores };
  }

  return {
    halalStatus: 'allowed',
    confidence: 0.85,
    reasons: [],
    riskScores: zeroRisk(),
  };
}

function fullRisk(): RiskScores {
  return { haramSubject: 1, haramContext: 1, ribaScore: 0, gharar: 0, maysir: 0, fraud: 0, spiritualRisk: 0, modestyRisk: 0 };
}

function zeroRisk(): RiskScores {
  return { haramSubject: 0, haramContext: 0, ribaScore: 0, gharar: 0, maysir: 0, fraud: 0, spiritualRisk: 0, modestyRisk: 0 };
}
