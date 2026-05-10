'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import type { Product } from '@/lib/types';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function FeaturedProducts({ products = [] }: { products?: Product[] }) {
  return (
    <section className="py-12 sm:py-20 bg-bg-alt/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="flex items-end justify-between mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="section-eyebrow mb-2">La sélection</p>
            <h2 className="font-outfit font-semibold text-xl sm:text-h2 text-slate">
              Produits mis en avant
            </h2>
          </div>
          <Button href="/categories/tech" variant="ghost" size="sm" className="hidden sm:flex">
            Tout voir
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: EASE }}
            >
              <ProductCard product={product} index={i} />
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Button href="/categories/tech" variant="ghost" size="sm">
            Tout voir
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}
