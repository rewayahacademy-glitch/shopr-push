/**
 * POST /api/admin/engine/feedback
 * Submit a manual correction for a product's halal classification.
 * Body: { productId, correctedStatus, correctedBy, notes? }
 *
 * GET /api/admin/engine/feedback
 * Returns the history of all manual corrections.
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getClientIp } from '@/lib/api/auth';
import { submitFeedback, getFeedbackHistory } from '@/lib/engine/modules/feedbackLearningLoop';
import { z } from 'zod';

const FeedbackSchema = z.object({
  productId:       z.string().min(1),
  correctedStatus: z.enum(['allowed', 'forbidden', 'doubtful', 'needs_review']),
  correctedBy:     z.string().min(1).max(100),
  notes:           z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const body = await req.json().catch(() => null);
  const parsed = FeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', details: parsed.error.issues }, { status: 400 });
  }

  const { productId, correctedStatus, correctedBy, notes } = parsed.data;

  const product = await import('@/lib/db').then(({ prisma }) =>
    prisma.product.findUnique({ where: { id: productId }, select: { id: true, halalStatus: true } })
  );

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const result = await submitFeedback({
    productId,
    previousStatus:  product.halalStatus,
    correctedStatus,
    correctedBy,
    ipAddress: getClientIp(req),
    notes,
  });

  return NextResponse.json(result, { status: 200 });
}

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const limit = Number(new URL(req.url).searchParams.get('limit') ?? '100');
  const history = await getFeedbackHistory(Math.min(limit, 500));

  return NextResponse.json({ history, count: history.length });
}
