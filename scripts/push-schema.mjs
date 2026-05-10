import { Client } from "@neondatabase/serverless";

const client = new Client(process.env.DATABASE_URL);

async function run(label, stmt) {
  try {
    await client.query(stmt);
    console.log("OK  -", label);
  } catch (e) {
    if (e.message.includes("already exists")) {
      console.log("SKIP -", label, "(already exists)");
    } else {
      console.error("ERR  -", label, "->", e.message.substring(0, 100));
    }
  }
}

async function main() {
  console.log("Connexion Neon HTTP (port 443)...\n");
  await client.connect();

  await run("schema public", `CREATE SCHEMA IF NOT EXISTS "public"`);

  await run("table Category", `CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
  )`);

  await run("index Category_slug", `CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug")`);

  await run("table Product", `CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "images" TEXT[] NOT NULL DEFAULT '{}',
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "affiliateUrl" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceDomain" TEXT NOT NULL,
    "sourceLogoUrl" TEXT,
    "badges" JSONB NOT NULL DEFAULT '[]',
    "qualityScore" DOUBLE PRECISION NOT NULL,
    "valueScore" DOUBLE PRECISION NOT NULL,
    "trendingScore" DOUBLE PRECISION,
    "affiliateScore" DOUBLE PRECISION,
    "complianceScore" DOUBLE PRECISION,
    "qualityPriceScore" DOUBLE PRECISION,
    "merchantTrustScore" DOUBLE PRECISION,
    "trendScore" DOUBLE PRECISION,
    "seasonalScore" DOUBLE PRECISION,
    "totalScore" DOUBLE PRECISION,
    "halalStatus" TEXT NOT NULL DEFAULT 'allowed',
    "rejectionReasons" TEXT[] NOT NULL DEFAULT '{}',
    "tags" TEXT[] NOT NULL DEFAULT '{}',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
  )`);

  await run("index Product_slug", `CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug")`);

  await run("fk Product->Category", `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Product_categoryId_fkey') THEN
      ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey"
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
  END $$`);

  await run("table AffiliateClick", `CREATE TABLE IF NOT EXISTS "AffiliateClick" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userAgent" TEXT,
    "referer" TEXT,
    "geo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
  )`);

  await run("fk AffiliateClick->Product", `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateClick_productId_fkey') THEN
      ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_productId_fkey"
        FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
  END $$`);

  await client.end();
  console.log("\n✅ Tables créées avec succès dans Neon !");
}

main().catch(console.error);