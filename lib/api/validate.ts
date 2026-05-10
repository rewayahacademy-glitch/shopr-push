import { z } from "zod";

export const BadgeSchema = z.object({
  label: z.string().min(1).max(30),
  variant: z.enum(["trending", "top-value", "new", "exclusive", "promo"]),
});

export const ProductCreateSchema = z.object({
  slug:              z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name:              z.string().min(2).max(200),
  description:       z.string().min(10).max(2000),
  shortDescription:  z.string().min(5).max(200),
  categoryId:        z.string().cuid(),
  imageUrl:          z.string().url(),
  images:            z.array(z.string().url()).max(10).default([]),
  price:             z.number().positive().max(100000),
  originalPrice:     z.number().positive().max(100000).optional(),
  currency:          z.string().length(3).default("EUR"),
  affiliateUrl:      z.string().url(),
  sourceName:        z.string().min(1).max(50),
  sourceDomain:      z.string().min(3).max(100),
  sourceLogoUrl:     z.string().url().optional(),
  badges:            z.array(BadgeSchema).max(5).default([]),
  qualityScore:      z.number().min(0).max(10),
  valueScore:        z.number().min(0).max(10),
  trendingScore:     z.number().min(0).max(100).optional(),
  affiliateScore:    z.number().min(0).max(1).optional(),
  complianceScore:   z.number().min(0).max(1).optional(),
  merchantTrustScore:z.number().min(0).max(1).optional(),
  halalStatus:       z.enum(["allowed", "forbidden", "doubtful", "needs_review"]).default("allowed"),
  rejectionReasons:  z.array(z.string()).max(10).default([]),
  tags:              z.array(z.string().min(1).max(30)).max(20).default([]),
  isAvailable:       z.boolean().default(true),
  featured:          z.boolean().default(false),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const CategoryCreateSchema = z.object({
  slug:        z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  name:        z.string().min(2).max(100),
  description: z.string().min(5).max(500),
  icon:        z.string().min(1).max(10),
  isActive:    z.boolean().default(true),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

export const HalalReviewSchema = z.object({
  halalStatus:      z.enum(["allowed", "forbidden", "doubtful", "needs_review"]),
  rejectionReasons: z.array(z.string()).max(10).default([]),
  complianceScore:  z.number().min(0).max(1).optional(),
  note:             z.string().max(500).optional(),
});

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit:  z.coerce.number().int().min(1).max(100).default(20),
});