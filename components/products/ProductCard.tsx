'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import { formatPrice, discountPercent } from '@/lib/utils';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  product: Product;
  index?: number;
  compact?: boolean;
}

async function trackClick(productId: string) {
  try {
    await fetch('/api/clicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
  } catch {
    // Ne pas bloquer la navigation si le tracking échoue
  }
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-slate/60 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-teal/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal to-salmon transition-all duration-700"
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className="w-8 text-right font-semibold text-slate/70 shrink-0">
        {score}/10
      </span>
    </div>
  );
}

export default function ProductCard({ product, index = 0, compact = false }: Props) {
  const discount = product.originalPrice
    ? discountPercent(product.originalPrice, product.price)
    : null;

  // Règle absolue : ne jamais afficher le bouton affilié si l'URL est invalide
  const hasValidAffiliateUrl =
    product.affiliateUrl &&
    product.affiliateUrl !== '#' &&
    product.affiliateUrl.startsWith('http');

  // Determine top-left badge to show (trending or new)
  const topLeftBadge = product.badges.find(
    (b) => b.variant === 'trending' || b.variant === 'new'
  );

  return (
    <motion.article
      className="group relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden
                 flex flex-col border border-bg-alt/60 h-full shadow-sm"
      whileHover={{
        y: -8,
        boxShadow: '0 24px 48px -8px rgba(3, 80, 88, 0.22), 0 8px 16px -4px rgba(3, 80, 88, 0.10)',
      }}
      transition={{ duration: 0.32, ease: EASE }}
    >
      {/* ── Image ── */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative overflow-hidden focus-ring rounded-t-2xl"
        aria-label={product.name}
      >
        <div
          className={`relative w-full overflow-hidden bg-bg-alt ${
            compact ? 'aspect-[4/3]' : 'aspect-[3/2]'
          }`}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          />

          {/* Bottom gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* Top-left badge: Trending / New */}
          {topLeftBadge && (
            <motion.span
              className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm
                ${topLeftBadge.variant === 'trending'
                  ? 'bg-salmon-light text-salmon border border-salmon/30'
                  : 'bg-white/90 text-slate border border-slate/20'}`}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: index * 0.06 }}
            >
              {topLeftBadge.variant === 'trending' && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-salmon mr-1 align-middle" />
              )}
              {topLeftBadge.label}
            </motion.span>
          )}

          {/* Top-right badge: Discount */}
          {discount !== null && discount > 0 && (
            <motion.span
              className="absolute top-3 right-3 bg-salmon text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md"
              initial={{ scale: 0, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: index * 0.06 + 0.05 }}
            >
              −{discount}%
            </motion.span>
          )}
        </div>
      </Link>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-5 gap-3 bg-white/95 backdrop-blur-sm">

        {/* Category pill */}
        <Link
          href={`/categories/${product.categorySlug}`}
          className="self-start text-xs font-semibold text-teal tracking-wide
                     bg-teal/8 px-2 py-0.5 rounded-full hover:bg-teal/15 transition-colors"
        >
          {product.categoryName}
        </Link>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block py-1 focus-ring rounded-lg">
          <h3
            className="font-outfit font-bold text-lg text-slate leading-snug
                       group-hover:text-teal transition-colors line-clamp-2"
          >
            {product.name}
          </h3>
        </Link>

        {/* Description — non-compact only */}
        {!compact && (
          <p className="text-sm text-slate/60 leading-relaxed line-clamp-2 flex-1">
            {product.shortDescription}
          </p>
        )}

        {/* Extra badges (non-top-left ones) — non-compact only */}
        {!compact && product.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.badges
              .filter((b) => b.variant !== 'trending' && b.variant !== 'new')
              .slice(0, 2)
              .map((b) => (
                <Badge key={b.variant} label={b.label} variant={b.variant} />
              ))}
          </div>
        )}

        {/* Score bars — non-compact only */}
        {!compact && (
          <div className="flex flex-col gap-1.5 py-1">
            <ScoreBar label="Rapport Q/P" score={product.valueScore} />
            <ScoreBar label="Qualité" score={product.qualityScore} />
          </div>
        )}

        {/* Footer: price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-bg-alt/80">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-outfit font-bold text-xl text-slate">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate/40 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {/* CTA button — only shown with valid affiliate URL */}
          {hasValidAffiliateUrl && (
            <motion.a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 bg-salmon text-white
                         px-4 py-2.5 min-h-[44px] rounded-full text-sm font-semibold shadow-sm
                         hover:bg-salmon/90 transition-colors focus-ring"
              aria-label={`Voir le deal pour ${product.name}`}
              onClick={() => trackClick(product.id)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              Voir le deal
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
