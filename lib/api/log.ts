import { prisma } from "@/lib/db";

type LogAction =
  | "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT"
  | "CREATE_CATEGORY" | "UPDATE_CATEGORY" | "DELETE_CATEGORY"
  | "HALAL_REVIEW" | "TOGGLE_AVAILABILITY" | "TOGGLE_FEATURED";

interface LogEntry {
  action: LogAction;
  entity: "product" | "category";
  entityId?: string;
  productId?: string;
  categoryId?: string;
  payload?: Record<string, unknown>;
  ipAddress?: string;
}

export async function auditLog(entry: LogEntry) {
  try {
    await prisma.adminLog.create({
      data: {
        id: "c" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36),
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        productId: entry.productId,
        categoryId: entry.categoryId,
        payload: entry.payload as never,
        ipAddress: entry.ipAddress,
      },
    });
  } catch {
    // non-blocking — log failure must never break the main request
  }
}