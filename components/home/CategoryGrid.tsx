'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Category } from '@/lib/types';
import {
  Cpu, Shirt, BookOpen, Dumbbell, Home,
  Camera, Tag,
} from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Slug-based icon map — reliable regardless of what the DB stores in `icon` */
const SLUG_TO_ICON: Record<string, React.ElementType> = {
  tech:    Cpu,
  mode:    Shirt,
  maison:  Home,
  sport:   Dumbbell,
  voyage:  Camera,
  cuisine: BookOpen,
};

export default function CategoryGrid({ categories = [] }: { categories?: Category[] }) {
  return (
    <section className="py-12 sm:py-24 relative overflow-hidden gradient-section-light">

      {/* Floating background accent shapes */}
      <motion.div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,148,122,0.08) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1], x: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(2,82,89,0.07) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.06, 1], y: [0, -12, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Orbiting ring top-left */}
      <motion.div
        className="absolute top-8 left-8 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <circle cx="45" cy="45" r="42" stroke="rgba(2,82,89,0.1)" strokeWidth="1" strokeDasharray="5 5"/>
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-14"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <span className="section-eyebrow">Univers</span>
          <h2 className="font-outfit font-bold text-3xl text-teal-deep mt-1">
            Explorer par catégorie
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = SLUG_TO_ICON[cat.slug] ?? Tag;
            /* Alternating teal / salmon accent */
            const accent = i % 2 === 0 ? 'teal' : 'salmon';

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.48, delay: i * 0.07, ease: EASE }}
              >
                <Link href={`/categories/${cat.slug}`} className="block focus-ring rounded-2xl">
                  <motion.div
                    className="relative p-5 rounded-2xl text-center bg-white border border-teal/8 overflow-hidden cursor-pointer shadow-card"
                    whileHover={{
                      y: -6,
                      boxShadow: accent === 'teal'
                        ? '0 16px 40px rgba(2,82,89,0.14), 0 4px 12px rgba(2,82,89,0.08)'
                        : '0 16px 40px rgba(255,148,122,0.2), 0 4px 12px rgba(255,148,122,0.1)',
                      borderColor: accent === 'teal' ? 'rgba(2,82,89,0.25)' : 'rgba(255,148,122,0.35)',
                    }}
                    transition={{ duration: 0.28 }}
                  >
                    {/* Hover shimmer overlay */}
                    <motion.div
                      className="absolute inset-0 opacity-0 pointer-events-none"
                      style={{
                        background: accent === 'teal'
                          ? 'radial-gradient(circle at 50% 0%, rgba(2,82,89,0.05) 0%, transparent 70%)'
                          : 'radial-gradient(circle at 50% 0%, rgba(255,148,122,0.07) 0%, transparent 70%)',
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    />

                    {/* Icon container */}
                    <motion.div
                      className="w-11 h-11 mx-auto rounded-xl flex items-center justify-center mb-3"
                      style={{
                        background: accent === 'teal'
                          ? 'rgba(2,82,89,0.08)'
                          : 'rgba(255,148,122,0.12)',
                      }}
                      whileHover={{
                        scale: 1.12,
                        background: accent === 'teal'
                          ? 'rgba(2,82,89,0.16)'
                          : 'rgba(255,148,122,0.22)',
                      }}
                      transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                    >
                      <Icon
                        size={20}
                        className={accent === 'teal' ? 'text-teal' : 'text-salmon'}
                        aria-hidden
                      />
                    </motion.div>

                    {/* Name */}
                    <p className="text-[0.72rem] font-bold text-teal-deep leading-snug">
                      {cat.name.split(' & ').map((part, j) => (
                        <span key={j} className="block">{part}</span>
                      ))}
                    </p>

                    {/* Count */}
                    {cat.productCount != null && (
                      <p className={`text-[0.62rem] font-medium mt-1.5 ${
                        accent === 'teal' ? 'text-teal/50' : 'text-salmon/60'
                      }`}>
                        {cat.productCount} produits
                      </p>
                    )}

                    {/* Bottom accent stripe (visible on hover) */}
                    <motion.div
                      className="absolute bottom-0 inset-x-0 h-0.5"
                      style={{
                        background: accent === 'teal'
                          ? 'linear-gradient(90deg, transparent, #025259, transparent)'
                          : 'linear-gradient(90deg, transparent, #ff947a, transparent)',
                        opacity: 0,
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
