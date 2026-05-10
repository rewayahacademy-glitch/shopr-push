import type { BadgeVariant } from '@/lib/types';

const styles: Record<BadgeVariant, string> = {
  trending:  'bg-salmon-light text-salmon border border-salmon/30',
  'top-value': 'bg-teal/10 text-teal border border-teal/20',
  new:       'bg-slate/10 text-slate border border-slate/20',
  exclusive: 'bg-teal-deep/10 text-teal-deep border border-teal-deep/20',
  promo:     'bg-salmon text-white border border-salmon/20',
};

interface Props {
  label: string;
  variant: BadgeVariant;
  className?: string;
}

export default function Badge({ label, variant, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold tracking-wide px-2.5 py-0.5 rounded-full ${styles[variant]} ${className}`}
    >
      {variant === 'trending' && (
        <span className="w-1.5 h-1.5 rounded-full bg-salmon inline-block" />
      )}
      {label}
    </span>
  );
}
