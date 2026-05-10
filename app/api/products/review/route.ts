export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const review = await prisma.product.findMany({
    where: {
      halalStatus: { in: ['doubtful', 'needs_review'] },
    },
    include: { category: true },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ review, count: review.length });
}
