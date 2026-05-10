'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import type { Product } from '@/lib/types';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Deterministic particle seeds */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x:    ((i * 131.5 + 17) % 100).toFixed(1),
  y:    ((i * 97.3  + 41) % 100).toFixed(1),
  r:    2 + (i % 4),
  type: i % 3 === 0 ? 'salmon' : 'teal',
  dur:  6 + (i % 5) * 1.4,
  delay:(i * 0.38) % 4,
}));

/* Background geometric shapes */
const SHAPES = [
  { type: 'circle', cx: '6%',  cy: '14%', w: 220, h: 220, color: 'rgba(2,82,89,0.055)',   dur: 18, delay: 0    },
  { type: 'hex',    cx: '80%', cy: '8%',  w: 160, h: 160, color: 'rgba(255,148,122,0.08)', dur: 22, delay: 2    },
  { type: 'ring',   cx: '88%', cy: '55%', w: 260, h: 260, color: 'rgba(2,82,89,0.045)',   dur: 26, delay: 4    },
  { type: 'circle', cx: '72%', cy: '80%', w: 130, h: 130, color: 'rgba(255,148,122,0.06)',dur: 14, delay: 1    },
  { type: 'hex',    cx: '15%', cy: '72%', w: 100, h: 100, color: 'rgba(2,82,89,0.06)',    dur: 19, delay: 3    },
  { type: 'ring',   cx: '42%', cy: '92%', w: 180, h: 180, color: 'rgba(255,148,122,0.05)',dur: 24, delay: 5    },
  { type: 'circle', cx: '50%', cy: '-4%', w: 340, h: 340, color: 'rgba(2,82,89,0.035)',   dur: 32, delay: 1.5  },
];

export default function Hero({ products = [] }: { products?: Product[] }) {
  const wrapRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  /* Parallax per layer — deeper = slower */
  const yBg      = useTransform(scrollY, [0, 700], [0,  -50]);   // shapes
  const yMid     = useTransform(scrollY, [0, 700], [0, -100]);   // particles
  const yContent = useTransform(scrollY, [0, 700], [0,  -65]);   // text + cards
  const opFade   = useTransform(scrollY, [0, 500], [1,    0]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden:   { opacity: 0, y: 28 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };

  const cards = products.slice(0, 3);
  const cardLayout = [
    { top: '2%',  left: '5%',  rotate: -5 },
    { top: '32%', left: '46%', rotate:  4 },
    { top: '58%', left: '2%',  rotate: -3 },
  ];

  return (
    <section
      ref={wrapRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #F7F5F2 0%, #EEF5F5 45%, #F7F5F2 100%)' }}
    >

      {/* ══ LAYER 1 — Large floating geometric shapes (slowest) ══ */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none">
        {SHAPES.map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: s.cx, top: s.cy }}
            animate={{ y: [0, -18, 0], rotate: s.type === 'hex' ? [0, 15, 0] : [0, 0, 0] }}
            transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
          >
            {s.type === 'circle' && (
              <div style={{ width: s.w, height: s.h, borderRadius: '50%', background: s.color }} />
            )}
            {s.type === 'hex' && (
              <svg width={s.w} height={s.h} viewBox="0 0 100 100">
                <polygon
                  points="50,2 93,26 93,74 50,98 7,74 7,26"
                  fill={s.color}
                  stroke={s.color.replace(/[\d.]+\)$/, '0.18)')}
                  strokeWidth="1"
                />
              </svg>
            )}
            {s.type === 'ring' && (
              <motion.div
                style={{ width: s.w, height: s.h }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: s.dur * 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46"
                    fill="none"
                    stroke={s.color.replace(/[\d.]+\)$/, '0.22)')}
                    strokeWidth="1"
                    strokeDasharray="6 5"
                  />
                  <circle cx="50" cy="50" r="34"
                    fill="none"
                    stroke={s.color.replace(/[\d.]+\)$/, '0.12)')}
                    strokeWidth="0.6"
                    strokeDasharray="3 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ══ LAYER 2 — Drifting particles (mid speed) ══ */}
      <motion.div style={{ y: yMid }} className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left:       `${p.x}%`,
              top:        `${p.y}%`,
              width:       p.r,
              height:      p.r,
              background:  p.type === 'salmon' ? '#ff947a' : '#025259',
              opacity:     p.type === 'salmon' ? 0.35 : 0.22,
            }}
            animate={{ y: [0, -20, 0], x: [0, 8, 0], opacity: p.type === 'salmon' ? [0.35, 0.7, 0.35] : [0.22, 0.45, 0.22] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}

        {/* Soft gradient blobs */}
        <div className="absolute" style={{
          left: '60%', top: '20%', width: 480, height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,148,122,0.07) 0%, transparent 65%)',
          filter: 'blur(32px)',
        }} />
        <div className="absolute" style={{
          left: '5%', top: '40%', width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2,82,89,0.07) 0%, transparent 65%)',
          filter: 'blur(36px)',
        }} />
      </motion.div>

      {/* ══ LAYER 3 — Content (slight parallax) ══ */}
      <motion.div
        style={{ y: yContent, opacity: opFade }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-10 sm:pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* ── Left: copy ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal/20 bg-teal/5 text-xs font-bold uppercase tracking-widest text-teal">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-salmon"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Sélection rigoureuse
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="font-outfit font-extrabold text-[2.6rem] sm:text-4xl lg:text-display leading-[1.05] tracking-tight text-teal-deep text-balance"
            >
              Shopping{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #025259 0%, #ff947a 60%, #025259 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 5s linear infinite',
                }}
              >
                intelligent
              </span>
              ,{' '}
              <br className="hidden sm:block" />
              sélection premium.
            </motion.h1>

            {/* Subline */}
            <motion.p variants={item} className="text-lg text-slate max-w-[440px] leading-relaxed">
              Des produits triés avec soin, évalués sur leur qualité réelle — pas sur leur budget publicitaire.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
              <Link href="/categories/tech" className="block sm:inline-block">
                <motion.button
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide text-white shadow-hover"
                  style={{ background: 'linear-gradient(135deg, #025259, #034F5A)' }}
                  whileHover={{ scale: 1.03, boxShadow: '0 16px 40px rgba(2,82,89,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  Explorer la boutique
                </motion.button>
              </Link>
              <Link href="/tendances" className="block sm:inline-block">
                <motion.button
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide text-salmon border-2 border-salmon/30 bg-salmon/5"
                  whileHover={{ borderColor: '#ff947a', backgroundColor: 'rgba(255,148,122,0.1)', scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Tendances
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={item} className="flex flex-wrap gap-3 sm:gap-6">
              {[
                { Icon: CheckCircle2, label: 'Sélection IA rigoureuse' },
                { Icon: RefreshCw,    label: 'Retours 30 jours' },
                { Icon: ShieldCheck,  label: 'Paiement sécurisé' },
              ].map(({ Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-sm text-slate">
                  <Icon size={15} className="text-teal flex-shrink-0" aria-hidden />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Mini stats */}
            <motion.div
              variants={item}
              className="hidden lg:flex gap-10 pt-4 border-t border-teal/10"
            >
              {[
                { value: '12k+', label: 'Produits' },
                { value: '4.9',  label: 'Note moy.' },
                { value: '98%',  label: 'Satisfaction' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-extrabold text-teal">{value}</div>
                  <div className="text-xs uppercase tracking-widest text-slate/60 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Mobile: horizontal scrollable card strip ── */}
          <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-3" style={{ width: 'max-content' }}>
              {cards.map((product, i) => (
                <motion.div
                  key={`m-${product.id}`}
                  className="w-40 flex-shrink-0 bg-white rounded-2xl shadow-card overflow-hidden border border-teal/8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: EASE }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-24 bg-bg-alt overflow-hidden">
                    <Image src={product.imageUrl} alt={product.name} fill sizes="160px" className="object-cover" />
                    {product.badges?.[0] && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-salmon text-white">
                        {product.badges[0].label}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 space-y-1">
                    <p className="text-[0.65rem] font-semibold text-teal-deep truncate">{product.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal">
                        {product.price}{product.currency === 'EUR' ? '€' : product.currency}
                      </span>
                      <span className="text-[9px] text-slate/50">★★★★★</span>
                    </div>
                    <div className="h-0.5 bg-teal/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal to-salmon"
                        style={{ width: `${(product.qualityScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-teal via-salmon to-transparent" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: floating product cards (desktop only) ── */}
          <div className="relative h-[520px] hidden lg:block">

            {/* Soft glow behind cards */}
            <div className="absolute" style={{
              top: '40%', left: '45%', transform: 'translate(-50%,-50%)',
              width: 320, height: 320, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,148,122,0.12) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }} />

            {/* Orbiting ring decoration */}
            <motion.div
              className="absolute"
              style={{ top: '42%', left: '60%', transform: 'translate(-50%,-50%)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                <circle cx="110" cy="110" r="104"
                  stroke="rgba(2,82,89,0.1)" strokeWidth="1" strokeDasharray="8 6"/>
              </svg>
            </motion.div>
            <motion.div
              className="absolute"
              style={{ top: '42%', left: '60%', transform: 'translate(-50%,-50%)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
                <circle cx="70" cy="70" r="66"
                  stroke="rgba(255,148,122,0.15)" strokeWidth="1" strokeDasharray="4 8"/>
              </svg>
            </motion.div>

            {/* Product cards */}
            {cards.map((product, i) => {
              const pos = cardLayout[i];
              return (
                <motion.div
                  key={product.id}
                  className="absolute w-52 bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer border border-teal/8"
                  style={{ top: pos.top, left: pos.left, rotate: pos.rotate }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: [0, -10, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.3 + i * 0.15, ease: EASE },
                    y: { duration: 4.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 1.3 },
                  }}
                  whileHover={{ scale: 1.04, rotate: 0, zIndex: 10, boxShadow: '0 20px 40px rgba(2,82,89,0.18)' }}
                >
                  {/* Image */}
                  <div className="relative h-36 bg-bg-alt overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="208px"
                      className="object-cover"
                    />
                    {product.badges?.[0] && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-salmon text-white shadow-sm">
                        {product.badges[0].label}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-3.5 space-y-1.5">
                    <p className="text-xs font-semibold text-teal-deep truncate">{product.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-teal">
                        {product.price}{product.currency === 'EUR' ? '€' : product.currency}
                      </span>
                      <span className="text-[10px] text-slate/50">★★★★★</span>
                    </div>
                    {/* Quality bar */}
                    <div className="h-1 bg-teal/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-teal to-salmon"
                        initial={{ width: 0 }}
                        animate={{ width: `${(product.qualityScore / 10) * 100}%` }}
                        transition={{ duration: 0.9, delay: 0.5 + i * 0.2, ease: EASE }}
                      />
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-0.5 bg-gradient-to-r from-teal via-salmon to-transparent" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #F7F5F2)' }} />

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: opFade }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.2em] text-teal/30">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-teal/30 to-transparent" />
      </motion.div>
    </section>
  );
}
