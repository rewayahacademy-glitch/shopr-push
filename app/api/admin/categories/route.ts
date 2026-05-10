export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, getClientIp } from "@/lib/api/auth";
import { CategoryCreateSchema } from "@/lib/api/validate";
import { auditLog } from "@/lib/api/log";

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const body = await req.json().catch(() => null);
  const parsed = CategoryCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  const category = await prisma.category.create({ data: parsed.data });
  auditLog({ action: "CREATE_CATEGORY", entity: "category", entityId: category.id, categoryId: category.id, payload: { slug: category.slug }, ipAddress: getClientIp(req) });
  return NextResponse.json(category, { status: 201 });
}