'use client';

interface Props {
  productId: string;
  affiliateUrl: string;
  productName: string;
  sourceName?: string;
  size?: 'md' | 'lg';
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

export default function AffiliateButton({
  productId,
  affiliateUrl,
  productName,
  sourceName,
  size = 'lg',
}: Props) {
  const sizeClasses =
    size === 'lg'
      ? 'px-8 py-4 text-base rounded-2xl gap-2.5'
      : 'px-5 py-2.5 text-sm rounded-xl gap-2';

  return (
    <div className="flex flex-col gap-3">
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={`Voir le produit ${productName} sur ${sourceName ?? 'le site marchand'}`}
        onClick={() => trackClick(productId)}
        className={`inline-flex items-center justify-center font-semibold tracking-wide
                    bg-salmon text-white hover:bg-salmon/90 transition-all duration-200
                    shadow-sm hover:shadow-md focus-ring select-none w-full sm:w-auto
                    ${sizeClasses}`}
      >
        Voir le produit
        {sourceName && <span className="opacity-80">sur {sourceName}</span>}
        <svg
          className="w-4 h-4 opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </a>

      <p className="text-xs text-slate/40 leading-relaxed">
        Lien affilié — SHOPR perçoit une commission sur les achats réalisés via ce lien,
        sans impact sur le prix que vous payez.
      </p>
    </div>
  );
}
