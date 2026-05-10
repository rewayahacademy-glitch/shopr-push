import { Client } from "@neondatabase/serverless";
const c = new Client(process.env.DATABASE_URL);
async function run(label, sql) {
  try { await c.query(sql); console.log("OK  -", label); }
  catch(e) {
    if (e.message.match(/already exists|duplicate/i)) console.log("SKIP -", label);
    else console.error("ERR  -", label, "->", e.message.slice(0,120));
  }
}
async function main() {
  await c.connect();

  // isActive column on Category
  await run("Category.isActive", `ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true`);

  // AdminLog table
  await run("table AdminLog", `CREATE TABLE IF NOT EXISTS "AdminLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "productId" TEXT,
    "categoryId" TEXT,
    "payload" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
  )`);

  await run("fk AdminLog->Product",  `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='AdminLog_productId_fkey') THEN ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$`);
  await run("fk AdminLog->Category", `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='AdminLog_categoryId_fkey') THEN ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$`);

  // Indexes - Product
  await run("idx Product.categoryId",                     `CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId")`);
  await run("idx Product.isAvailable+halalStatus",        `CREATE INDEX IF NOT EXISTS "Product_isAvailable_halalStatus_idx" ON "Product"("isAvailable","halalStatus")`);
  await run("idx Product.isAvailable+halalStatus+trending",`CREATE INDEX IF NOT EXISTS "Product_isAvailable_halalStatus_trendingScore_idx" ON "Product"("isAvailable","halalStatus","trendingScore" DESC)`);
  await run("idx Product.isAvailable+halalStatus+value",  `CREATE INDEX IF NOT EXISTS "Product_isAvailable_halalStatus_valueScore_idx" ON "Product"("isAvailable","halalStatus","valueScore" DESC)`);
  await run("idx Product.isAvailable+halalStatus+price",  `CREATE INDEX IF NOT EXISTS "Product_isAvailable_halalStatus_price_idx" ON "Product"("isAvailable","halalStatus","price")`);
  await run("idx Product.featured",                       `CREATE INDEX IF NOT EXISTS "Product_featured_isAvailable_halalStatus_idx" ON "Product"("featured","isAvailable","halalStatus")`);
  await run("idx Product.createdAt",                      `CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt" DESC)`);

  // Indexes - AffiliateClick
  await run("idx Click.productId+createdAt", `CREATE INDEX IF NOT EXISTS "AffiliateClick_productId_createdAt_idx" ON "AffiliateClick"("productId","createdAt" DESC)`);
  await run("idx Click.createdAt",           `CREATE INDEX IF NOT EXISTS "AffiliateClick_createdAt_idx" ON "AffiliateClick"("createdAt" DESC)`);

  // Indexes - AdminLog
  await run("idx AdminLog.entity+entityId", `CREATE INDEX IF NOT EXISTS "AdminLog_entity_entityId_idx" ON "AdminLog"("entity","entityId")`);
  await run("idx AdminLog.createdAt",       `CREATE INDEX IF NOT EXISTS "AdminLog_createdAt_idx" ON "AdminLog"("createdAt" DESC)`);
  await run("idx AdminLog.action",          `CREATE INDEX IF NOT EXISTS "AdminLog_action_idx" ON "AdminLog"("action")`);

  await c.end();
  console.log("\n✅ Migration v2 terminée — indexes + AdminLog opérationnels !");
}
main().catch(console.error);