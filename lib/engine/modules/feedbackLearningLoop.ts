/**
 * feedbackLearningLoop — stores manual corrections from admin review.
 *
 * Every correction is logged in AdminLog and applied to the product.
 * Accumulated corrections form a training signal for future threshold tuning.
 *
 * Visibility rules after correction:
 *  - 'allowed'      → isAvailable stays as-is (admin may set separately)
 *  - 'doubtful'     → isAvailable = false (not shown until cleared)
 *  - 'needs_review' → isAvailable = false (pending further review)
 *  - 'forbidden'    → isAvailable = false (hard reject)
 */

import { prisma } from '@/lib/db';
import type { HalalStatus } from '../types';

export interface FeedbackInput {
  productId:       string;
  previousStatus:  string;
  correctedStatus: HalalStatus;
  correctedBy:     string;
  ipAddress?:      string;
  notes?:          string;
}

export interface FeedbackResult {
  success:       boolean;
  productId:     string;
  appliedStatus: HalalStatus;
  error?:        string;
}

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackResult> {
  const { productId, correctedStatus, correctedBy, previousStatus, notes, ipAddress } = input;

  /* Only 'allowed' products are shown publicly — all other statuses hide the product */
  const isAvailableNow = correctedStatus === 'allowed';

  /* Rejection reasons: cleared when approved, set to manual_correction otherwise */
  const newRejectionReasons: string[] =
    correctedStatus === 'allowed' ? [] : ['manual_correction'];

  try {
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          halalStatus:      correctedStatus,
          isAvailable:      isAvailableNow,
          rejectionReasons: newRejectionReasons,
          /* Reset engine scores so next updateAllScores re-evaluates correctly */
          totalScore:       isAvailableNow ? undefined : 0,
        },
      }),
      prisma.adminLog.create({
        data: {
          action:    'feedback_correction',
          entity:    'Product',
          entityId:  productId,
          productId,
          ipAddress: ipAddress ?? null,
          payload: {
            previousStatus,
            correctedStatus,
            correctedBy,
            notes:          notes ?? null,
            isAvailableNow,
            correctedAt:    new Date().toISOString(),
          },
        },
      }),
    ]);

    return { success: true, productId, appliedStatus: correctedStatus };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[feedbackLearningLoop] submitFeedback failed for product ${productId}:`, message);
    return {
      success:       false,
      productId,
      appliedStatus: correctedStatus,
      error:         message,
    };
  }
}

/* Returns all manual corrections logged so far (for learning audit) */
export async function getFeedbackHistory(limit = 100) {
  return prisma.adminLog.findMany({
    where:   { action: 'feedback_correction' },
    orderBy: { createdAt: 'desc' },
    take:    limit,
    select: {
      id:        true,
      productId: true,
      payload:   true,
      ipAddress: true,
      createdAt: true,
    },
  });
}
