export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, getClientIp } from "@/lib/api/auth";
import { ProductUpdateSchema } from "@/lib/api/validate";
import { auditLog } from "@/lib/api/log";

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true, _count: { select: { clicks: true } } },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const body = await req.json().catch(() => null);
  const parsed = ProductUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  const existing = await prisma.product.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { badges, ...rest } = parsed.data;
  const updated = await prisma.product.update({
    where: { id: params.id },
    data: { ...rest, ...(badges !== undefined ? { badges: badges as never } : {}), lastUpdated: new Date() },
    include: { category: { select: { id: true, slug: true, name: true } } },
  });
  auditLog({ action: "UPDATE_PRODUCT", entity: "product", entityId: params.id, productId: params.id, payload: parsed.data as Record<string, unknown>, ipAddress: getClientIp(req) });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const existing = await prisma.product.findUnique({ where: { id: params.id }, select: { id: true, slug: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.product.update({ where: { id: params.id }, data: { isAvailable: false } });
  auditLog({ action: "DELETE_PRODUCT", entity: "product", entityId: params.id, productId: params.id, payload: { slug: existing.slug }, ipAddress: getClientIp(req) });
  return NextResponse.json({ success: true, message: "Product deactivated" });
}