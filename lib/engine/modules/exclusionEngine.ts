import type { Product } from '../../types';
import type { RejectedProduct, ReviewProduct, RejectionReason } from '../types';
import { hasValidAffiliateLink } from './affiliateValidation';
import { classifyHalalDetailed } from './halalPolicyEngine';

export interface ExclusionResult {
  accepted: Product[];
  rejected: RejectedProduct[];
  review:   ReviewProduct[];
}

export function runExclusion(products: Product[]): ExclusionResult {
  const accepted: Product[]         = [];
  const rejected: RejectedProduct[] = [];
  const review:   ReviewProduct[]   = [];

  for (const product of products) {
    const reasons: RejectionReason[] = [];

    if (!hasValidAffiliateLink(product)) reasons.push('no_affiliate_link');
    if (!product.isAvailable)            reasons.push('unavailable');
    if (!product.name || product.price <= 0) reasons.push('insufficient_data');

    const classification = classifyHalalDetailed(product);

    if (classification.halalStatus === 'forbidden') {
      reasons.push('haram');
    }

    if (reasons.length > 0) {
      rejected.push({ product, reasons });
      continue;
    }

    if (
      classification.halalStatus === 'doubtful' ||
      classification.halalStatus === 'needs_review'
    ) {
      review.push({
        product,
        flaggedFor:  classification.reasons.join(', ') || 'halal_compliance',
        halalStatus: classification.halalStatus,
        confidence:  classification.confidence,
        reasons:     classification.reasons,
      });
      continue;
    }

    accepted.push(product);
  }

  return { accepted, rejected, review };
}
