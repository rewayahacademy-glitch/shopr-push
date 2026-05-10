export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, getClientIp } from "@/lib/api/auth";
import { ProductCreateSchema, PaginationSchema } from "@/lib/api/validate";
import { auditLog } from "@/lib/api/log";
import { buildCursorArgs, paginatedResponse } from "@/lib/api/paginate";

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const { cursor, limit } = PaginationSchema.parse(sp);
  const { category, halal, available, search } = sp;

  const items = await prisma.product.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(halal ? { halalStatus: halal } : {}),
      ...(available !== undefined ? { isAvailable: available === "true" } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      } : {}),
    },
    include: { category: { select: { id: true, slug: true, name: true } } },
    orderBy: { createdAt: "desc" },
    ...buildCursorArgs(cursor, limit),
  });

  return NextResponse.json(paginatedResponse(items, limit));
}

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const body = await req.json().catch(() => null);
  const parsed = ProductCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const { badges, ...rest } = parsed.data;
  const product = await prisma.product.create({
    data: { ...rest, badges: badges as never },
    include: { category: { select: { id: true, slug: true, name: true } } },
  });

  auditLog({ action: "CREATE_PRODUCT", entity: "product", entityId: product.id, productId: product.id, payload: { slug: product.slug }, ipAddress: getClientIp(req) });

  return NextResponse.json(product, { status: 201 });
}