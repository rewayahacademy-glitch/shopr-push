'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Scale, Eye, RefreshCw, type LucideIcon } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pillars: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: CheckCircle2,
    title: 'Sélection manuelle',
    body: "Chaque produit est évalué selon des critères stricts avant d'être publié. Pas d'algorithme aveugle.",
  },
  {
    icon: Scale,
    title: 'Rapport qualité/prix',
    body: 'Nous ne sélectionnons que les articles dont la valeur justifie le prix. Fini les achats regrettés.',
  },
  {
    icon: Eye,
    title: 'Transparence totale',
    body: 'Liens affiliés identifiés, commission transparente. Votre confiance passe avant le revenu.',
  },
  {
    icon: RefreshCw,
    title: 'Mis à jour en temps réel',
    body: 'Prix, disponibilité et scores sont vérifiés quotidiennement pour vous garantir des infos fiables.',
  },
];

export default function ValueProposition() {
  return (
    <section className="py-16 sm:py-20 bg-teal text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center mb-8 sm:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-salmon/80 mb-3">Notre engagement</p>
          <h2 className="font-outfit font-bold text-h2 text-white text-balance">
            Pourquoi SHOPR ?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              className="flex flex-col gap-4 border border-white/10 rounded-2xl p-6 sm:border-transparent sm:rounded-none sm:p-0"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: EASE }}
            >
              <motion.div
                className="w-fit"
                whileHover={{ scale: 1.2, rotate: 6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                aria-hidden
              >
                <Icon className="w-7 h-7 text-salmon" strokeWidth={1.75} />
              </motion.div>
              <div>
                <h3 className="font-outfit font-semibold text-h4 text-white mb-2">{title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
