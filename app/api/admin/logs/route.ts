export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api/auth";
import { PaginationSchema } from "@/lib/api/validate";
import { buildCursorArgs, paginatedResponse } from "@/lib/api/paginate";

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const { cursor, limit } = PaginationSchema.parse(sp);
  const { action, entity } = sp;

  const items = await prisma.adminLog.findMany({
    where: {
      ...(action ? { action } : {}),
      ...(entity ? { entity } : {}),
    },
    orderBy: { createdAt: "desc" },
    ...buildCursorArgs(cursor, limit),
  });

  return NextResponse.json(paginatedResponse(items, limit));
}