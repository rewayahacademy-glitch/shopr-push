'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '@/lib/types';
import { CATEGORY_EMOJI } from '@/lib/constants';

export default function Header({ categories = [] }: { categories?: Category[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-teal/96 backdrop-blur-md shadow-nav'
          : 'bg-teal'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus-ring rounded-lg min-h-[44px]">
            <span className="font-outfit font-bold text-2xl tracking-tight text-white">SHOPR</span>
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-salmon"
              whileHover={{ scale: 1.7 }}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Catégories">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 focus-ring min-h-[44px] flex items-center link-underline"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/tendances"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-salmon hover:text-salmon-hover transition-colors focus-ring rounded-lg px-2 py-1"
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-salmon inline-block"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              Tendances
            </Link>

            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all focus-ring min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-teal-deep border-t border-white/10 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1" aria-label="Menu mobile">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={`/categories/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="text-lg flex-shrink-0" aria-hidden>{CATEGORY_EMOJI[cat.slug] ?? '◆'}</span>
                    <span className="truncate">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2">
                <Link
                  href="/tendances"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-salmon"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-salmon" />
                  Tendances du moment
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
