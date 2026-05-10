import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({ products, emptyMessage = 'Aucun produit disponible.' }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-teal/50">
        <span className="text-5xl block mb-4">◎</span>
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
