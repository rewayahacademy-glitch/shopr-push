import type { Product } from './types';

export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function sortProducts(products: Product[], sort: string): Product[] {
  const arr = [...products];
  switch (sort) {
    case 'trending':   return arr.sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0));
    case 'value':      return arr.sort((a, b) => b.valueScore - a.valueScore);
    case 'price-asc':  return arr.sort((a, b) => a.price - b.price);
    case 'price-desc': return arr.sort((a, b) => b.price - a.price);
    case 'newest':     return arr.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
    default:           return arr;
  }
}
