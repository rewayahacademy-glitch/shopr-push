'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to email service (Mailchimp, Resend, etc.)
    setSubmitted(true);
  };

  return (
    <section className="py-16 gradient-teal overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        <motion.span
          className="inline-flex items-center gap-1.5 bg-salmon/15 text-salmon text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border border-salmon/20 mb-6"
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-salmon inline-block"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          Bientôt disponible
        </motion.span>

        <motion.h2
          className="font-outfit font-bold text-white text-h2 text-balance mb-4"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Recevez les meilleures offres
        </motion.h2>

        <motion.p
          className="text-white/60 text-sm sm:text-base mb-8 text-balance"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          Alertes tendances, sélections exclusives et bons plans qualité/prix — directement dans votre boîte mail.
          Zéro spam.
        </motion.p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="flex items-center justify-center gap-3 text-salmon font-semibold"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Parfait ! Vous serez parmi les premiers informés.
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              noValidate
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <motion.input
                type="email"
                required
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40
                           text-sm font-medium focus:outline-none focus:ring-2 focus:ring-salmon focus:border-transparent
                           transition-all"
                aria-label="Votre adresse e-mail"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <motion.button
                type="submit"
                className="px-6 py-3 rounded-xl bg-salmon text-white text-sm font-semibold
                           shadow-sm shrink-0 focus-ring"
                whileHover={{ scale: 1.05, backgroundColor: '#fb7d69' }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                Me notifier
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.p
          className="text-white/55 text-xs mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          En vous inscrivant, vous acceptez notre politique de confidentialité. Désinscription à tout moment.
        </motion.p>
      </div>
    </section>
  );
}
