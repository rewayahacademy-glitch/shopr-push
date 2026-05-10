import type { Product } from '../types';

export type HalalStatus = 'allowed' | 'forbidden' | 'doubtful' | 'needs_review';

export type RejectionReason =
  | 'no_affiliate_link'
  | 'haram'
  | 'doubtful_halal'
  | 'unavailable'
  | 'misleading'
  | 'fake_urgency'
  | 'prohibited_category'
  | 'insufficient_data'
  | 'unreliable_merchant'
  | 'spiritual_risk'
  | 'modesty_violation'
  | 'riba_detected'
  | 'gharar_detected'
  | 'maysir_detected'
  | 'fraud_risk'
  | 'manual_correction';

export interface RiskScores {
  haramSubject:  number;   // 0–1 — subject itself forbidden
  haramContext:  number;   // 0–1 — use/context forbidden
  ribaScore:     number;   // 0–1
  gharar:        number;   // 0–1
  maysir:        number;   // 0–1
  fraud:         number;   // 0–1
  spiritualRisk: number;   // 0–1
  modestyRisk:   number;   // 0–1
}

export interface ClassificationResult {
  halalStatus: HalalStatus;
  confidence:  number;       // 0–1, 1 = very certain
  reasons:     string[];
  riskScores:  RiskScores;
}

export interface ProductScore {
  productId:          string;
  affiliateScore:     number;   // 0–1
  complianceScore:    number;   // 0–1
  qualityPriceScore:  number;   // 0–1
  merchantTrustScore: number;   // 0–1
  trendScore:         number;   // 0–1
  seasonalScore:      number;   // 0–1
  totalScore:         number;   // 0–1 weighted aggregate
}

export interface RejectedProduct {
  product: Product;
  reasons: RejectionReason[];
}

export interface ReviewProduct {
  product:     Product;
  flaggedFor:  string;
  halalStatus: HalalStatus;
  confidence:  number;
  reasons:     string[];
}

export interface EngineResult {
  shortlist: Product[];
  rejected:  RejectedProduct[];
  review:    ReviewProduct[];
  scores:    ProductScore[];
}

export interface EngineInput {
  products:      Product[];
  geo?:          string;
  maxShortlist?: number;
}
