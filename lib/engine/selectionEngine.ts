import type { EngineInput, EngineResult } from './types';
import { ingestProducts } from './modules/productIngestion';
import { runExclusion } from './modules/exclusionEngine';
import { rankProducts } from './modules/rankingEngine';
import { addToReviewQueue } from './modules/manualReviewQueue';
import { hasValidAffiliateLink } from './modules/affiliateValidation';
import { SHORTLIST_MAX } from './config';

/**
 * Main entry point for the selection engine.
 *
 * Flow:
 *   raw input
 *     → productIngestion    (normalize & sanitize)
 *     → exclusionEngine     (reject haram / no-affiliate / unavailable)
 *     → manualReviewQueue   (log doubtful cases)
 *     → rankingEngine       (weighted multi-dimensional score)
 *     → shortlist           (top N, final safety check on affiliate URL)
 *
 * Invariants enforced:
 *   no_affiliate_no_display — every product in the shortlist has a valid HTTPS affiliate URL
 *   no_compliance_no_display — only 'allowed' halal status products reach the shortlist
 */
export async function runSelectionEngine(input: EngineInput): Promise<EngineResult> {
  const { products: raw, geo, maxShortlist = SHORTLIST_MAX } = input;

  const normalized = ingestProducts(raw as unknown[]);
  const { accepted, rejected, review } = runExclusion(normalized);

  await addToReviewQueue(review);

  const { ranked, scores } = rankProducts(accepted, geo);

  /* Final safety fence: enforce no_affiliate_no_display at the output boundary.
   * This catches any edge case where a product slipped through exclusion
   * but still lacks a valid affiliate URL at display time. */
  const shortlist = ranked
    .filter((p) => hasValidAffiliateLink(p))
    .slice(0, maxShortlist);

  return { shortlist, rejected, review, scores };
}
