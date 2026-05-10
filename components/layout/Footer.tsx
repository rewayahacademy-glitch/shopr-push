'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Category } from '@/lib/types';

export default function Footer({ categories = [] }: { categories?: Category[] }) {
  return (
    <footer className="bg-teal-deep text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group min-h-[44px]">
              <span className="font-outfit font-bold text-2xl tracking-tight text-white">SHOPR</span>
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-salmon inline-block"
                whileHover={{ scale: 1.7 }}
                transition={{ type: 'spring', stiffness: 400 }}
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Shopping intelligent. Une sélection rigoureuse, pensée pour la qualité et le rapport qualité/prix.
            </p>
            <p className="text-xs text-white/40 mt-4">
              Site d&apos;affiliation — nous percevons une commission sur les ventes réalisées via nos liens.
            </p>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">Catégories</h3>
            <ul className="space-y-0">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="block py-2 text-sm text-white/60 hover:text-white transition-colors link-underline"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sélections */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">Sélections</h3>
            <ul className="space-y-0">
              {[
                { label: 'Tendances du moment', href: '/tendances' },
                { label: 'Top rapport qualité/prix', href: '/top-valeur' },
                { label: 'Nouveautés', href: '/nouveautes' },
                { label: 'Exclusivités', href: '/exclusivites' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 text-sm text-white/60 hover:text-white transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">Informations</h3>
            <ul className="space-y-0">
              {[
                { label: 'Notre politique de sélection', href: '/politique-selection' },
                { label: 'Mentions légales', href: '/mentions-legales' },
                { label: 'Politique de confidentialité', href: '/confidentialite' },
                { label: "Politique d'affiliation", href: '/affiliation' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 text-sm text-white/60 hover:text-white transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} SHOPR. Tous droits réservés.
          </p>
          <p className="text-xs text-white/40 text-center">
            Les prix affichés sont indicatifs et peuvent varier. Vérifiez toujours le prix final sur le site partenaire.
          </p>
        </div>
      </div>
    </footer>
  );
}
