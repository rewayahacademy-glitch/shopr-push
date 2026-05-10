export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, getClientIp } from "@/lib/api/auth";
import { HalalReviewSchema } from "@/lib/api/validate";
import { auditLog } from "@/lib/api/log";

type Ctx = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Ctx) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const body = await req.json().catch(() => null);
  const parsed = HalalReviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.product.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { halalStatus, rejectionReasons, complianceScore, note } = parsed.data;

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: {
      halalStatus,
      rejectionReasons,
      ...(complianceScore !== undefined ? { complianceScore } : {}),
      isAvailable: halalStatus === "allowed",
      lastUpdated: new Date(),
    },
  });

  auditLog({
    action: "HALAL_REVIEW",
    entity: "product",
    entityId: params.id,
    productId: params.id,
    payload: { halalStatus, rejectionReasons, complianceScore, note },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json(updated);
}