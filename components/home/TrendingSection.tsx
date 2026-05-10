'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import type { Product } from '@/lib/types';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function TrendingSection({ products = [] }: { products?: Product[] }) {
  const top4 = products.slice(0, 4);

  return (
    <section className="py-12 sm:py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="flex items-end justify-between mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-salmon inline-block"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <p className="section-eyebrow">En ce moment</p>
            </div>
            <h2 className="font-outfit font-semibold text-xl sm:text-h2 text-slate">Tendances</h2>
          </div>
          <Button href="/tendances" variant="ghost" size="sm" className="hidden sm:flex">
            Toutes les tendances
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {top4.map((product, i) => (
            <motion.div
              key={product.id}
              className="relative overflow-visible"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
            >
              <motion.div
                className={`absolute -top-3 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                  i === 0 ? 'bg-salmon text-white' : 'bg-bg-surface text-teal border border-teal/20'
                }`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 16,
                  delay: 0.25 + i * 0.1,
                }}
              >
                #{i + 1}
              </motion.div>
              <ProductCard product={product} index={i} compact />
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Button href="/tendances" variant="ghost" size="sm">
            Toutes les tendances
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </div>

        <motion.p
          className="text-center text-xs text-teal/40 mt-6 sm:mt-10 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <RefreshCw className="w-3 h-3 inline-block mr-1 opacity-60" strokeWidth={2} aria-hidden />
          Classement mis à jour quotidiennement · Basé sur popularité et score qualité/prix
        </motion.p>
      </div>
    </section>
  );
}
