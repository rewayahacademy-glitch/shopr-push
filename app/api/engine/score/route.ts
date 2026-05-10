/**
 * POST /api/engine/score
 * Re-scores all products in the database through the full selection engine.
 * Protected — requires admin Bearer token.
 * Optional body: { geo: "FR" }
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/auth';
import { updateAllScores } from '@/lib/engine/db/scoreUpdater';

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const geo  = typeof body.geo === 'string' ? body.geo : undefined;

  const result = await updateAllScores(geo);

  return NextResponse.json({
    success: true,
    geo:     geo ?? 'global',
    ...result,
  });
}
