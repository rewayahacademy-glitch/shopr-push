'use client';

import { useState } from 'react';
import type { SortOption } from '@/lib/types';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'trending',   label: 'Tendance' },
  { value: 'value',      label: 'Rapport Q/P' },
  { value: 'price-asc',  label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest',     label: 'Nouveautés' },
];

interface Props {
  total: number;
  onSortChange?: (sort: SortOption) => void;
  currentSort?: SortOption;
}

export default function ProductFilters({ total, onSortChange, currentSort = 'trending' }: Props) {
  const [sort, setSort] = useState<SortOption>(currentSort);

  const handleSort = (value: SortOption) => {
    setSort(value);
    onSortChange?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

      <p className="text-sm text-teal/60 font-medium">
        <span className="font-bold text-teal">{total}</span> article{total > 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <span className="text-xs text-teal/50 font-semibold tracking-wide uppercase shrink-0">
          Trier
        </span>
        <div className="flex gap-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`shrink-0 text-xs font-semibold px-3 py-2.5 min-h-[44px] rounded-xl border transition-all duration-200 focus-ring ${
                sort === opt.value
                  ? 'bg-teal text-white border-teal'
                  : 'bg-bg-surface text-teal/70 border-bg-alt hover:border-teal/30 hover:text-teal'
              }`}
              aria-pressed={sort === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
