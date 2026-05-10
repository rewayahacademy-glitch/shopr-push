export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const click = await prisma.affiliateClick.create({
    data: {
      productId,
      userAgent: req.headers.get("user-agent") ?? undefined,
      referer: req.headers.get("referer") ?? undefined,
    },
  });

  return NextResponse.json(click, { status: 201 });
}