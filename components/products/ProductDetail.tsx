import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import ScoreBar from '@/components/ui/ScoreBar';
import AffiliateButton from '@/components/products/AffiliateButton';
import { formatPrice, discountPercent } from '@/lib/utils';

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  const discount = product.originalPrice
    ? discountPercent(product.originalPrice, product.price)
    : null;

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-teal/50 mb-8" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-teal transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-teal transition-colors capitalize">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-slate font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-bg-alt shadow-card">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {discount && (
            <span className="absolute top-4 right-4 bg-salmon text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow">
              −{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">

          {/* Category + badges */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/categories/${product.categorySlug}`}
              className="text-xs font-bold text-teal/60 uppercase tracking-widest hover:text-teal transition-colors"
            >
              {product.categoryName}
            </Link>
            {product.badges.map((b) => (
              <Badge key={b.variant} label={b.label} variant={b.variant} />
            ))}
          </div>

          {/* Name */}
          <h1 className="font-outfit font-bold text-h1 text-slate leading-tight text-balance">
            {product.name}
          </h1>

          {/* Short description */}
          <p className="text-body-lg text-teal/70 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Score bars */}
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-bg-alt/60 border border-bg-alt">
            <p className="text-xs font-bold text-teal uppercase tracking-widest mb-1">Évaluation SHOPR</p>
            <ScoreBar label="Qualité" score={product.qualityScore} />
            <ScoreBar label="Rapport Q/P" score={product.valueScore} />
            {product.trendingScore !== undefined && (
              <ScoreBar label="Popularité" score={Math.round(product.trendingScore / 10)} />
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-outfit font-bold text-display text-slate">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-body-lg text-teal/40 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {/* Source */}
          <p className="text-xs text-teal/50 -mt-2">
            Via <span className="font-semibold text-teal/70">{product.source.name}</span>
            {' · '}Prix indicatif, vérifié le {new Date(product.lastUpdated).toLocaleDateString('fr-FR')}
          </p>

          {/* CTA with click tracking */}
          <AffiliateButton
            productId={product.id}
            affiliateUrl={product.affiliateUrl}
            productName={product.name}
            sourceName={product.source.name}
            size="lg"
          />

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-bg-alt">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-bg-alt text-teal/60 font-medium capitalize">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full description */}
      <div className="mt-16 max-w-2xl">
        <h2 className="font-outfit font-semibold text-h3 text-slate mb-4">Description</h2>
        <p className="text-body text-teal/70 leading-relaxed">{product.description}</p>
      </div>
    </article>
  );
}
