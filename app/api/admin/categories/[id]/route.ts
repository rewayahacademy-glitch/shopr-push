export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, getClientIp } from "@/lib/api/auth";
import { CategoryUpdateSchema } from "@/lib/api/validate";
import { auditLog } from "@/lib/api/log";

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const cat = await prisma.category.findUnique({
    where: { id: params.id },
    include: { _count: { select: { products: true } } },
  });
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const body = await req.json().catch(() => null);
  const parsed = CategoryUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  const existing = await prisma.category.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const cat = await prisma.category.update({ where: { id: params.id }, data: parsed.data });
  auditLog({ action: "UPDATE_CATEGORY", entity: "category", entityId: params.id, categoryId: params.id, payload: parsed.data as Record<string, unknown>, ipAddress: getClientIp(req) });
  return NextResponse.json(cat);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const count = await prisma.product.count({ where: { categoryId: params.id } });
  if (count > 0) return NextResponse.json({ error: `Cannot delete: ${count} product(s) still in this category` }, { status: 409 });
  await prisma.category.delete({ where: { id: params.id } });
  auditLog({ action: "DELETE_CATEGORY", entity: "category", entityId: params.id, categoryId: params.id, ipAddress: getClientIp(req) });
  return NextResponse.json({ success: true });
}