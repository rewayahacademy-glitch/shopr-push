# SHOPR — Contexte global du projet

## C'est quoi SHOPR ?
Plateforme d'affiliation halal certifiée. Pas de checkout, pas de comptes utilisateurs — on affiche des produits halal avec des liens affiliés vers des marchands externes. Le moteur de classification halal filtre et classe automatiquement les produits.

## Stack technique
- **Framework** : Next.js 14 App Router (TypeScript)
- **Base de données** : Neon (PostgreSQL serverless) via Prisma v7
- **ORM** : Prisma avec @prisma/adapter-neon
- **Styles** : Tailwind CSS
- **Validation** : Zod
- **Déploiement** : Vercel
- **Auth admin** : Bearer token (ADMIN_SECRET dans .env.local)

## Structure du projet
```
app/
  api/                    ← Routes API REST (COMPLET)
    admin/                ← CRUD produits, catégories, analytics, logs, halal
    products/             ← GET produits publics
    categories/           ← GET catégories publiques
    clicks/               ← POST tracking clics affiliés
    engine/               ← Score, feedback, review queue
  categories/[slug]/      ← Page catégorie (frontend)
  products/[slug]/        ← Page produit (à créer ou améliorer)
  page.tsx                ← Homepage
  layout.tsx              ← Layout root
components/
  home/                   ← Hero, CategoryGrid, FeaturedProducts, TrendingSection, ValueProposition, NewsletterBanner
  products/               ← ProductCard, ProductGrid, ProductFilters, ProductDetail
  layout/                 ← Header, Footer
  ui/                     ← Badge, Button, ScoreBar
lib/
  engine/                 ← Moteur halal (COMPLET)
    modules/              ← halalPolicyEngine, ribaEngine, modestyPolicyEngine, spiritualRiskEngine, etc.
    db/                   ← scoreUpdater
    config.ts, index.ts, selectionEngine.ts, types.ts
  api/                    ← auth, log, paginate, rate-limit, validate
  db.ts, queries.ts, types.ts, utils.ts, constants.ts, mock-data.ts
prisma/
  schema.prisma           ← Schéma DB
  seed.ts                 ← Données de test
scripts/                  ← Migration, seed, fix-encoding
```

## État actuel
- **Backend API** : COMPLET — tous les endpoints REST fonctionnels
- **Intelligence Engine** : COMPLET — classification halal, scoring, feedback loop, review queue
- **Frontend** : PARTIEL — pages existent mais utilisent mock-data.ts au lieu de l'API réelle
- **Admin Dashboard UI** : MANQUANT — pas d'interface admin (seulement les API)
- **Page produit** : À vérifier / améliorer
- **Newsletter** : Bannière présente, logique manquante

## Règles absolues du projet
1. **Pas de checkout** — seulement des liens affiliés externes
2. **Pas de comptes utilisateurs** — site public only
3. **no_affiliate_no_display** — un produit sans URL affiliée valide n'est jamais affiché
4. **no_compliance_no_display** — un produit non-certifié halal n'est jamais affiché
5. **no_data_invention** — ne jamais inventer de données (prix, avis, stocks)
6. **no_opaque_logic** — toute décision du moteur doit être traçable

## Variables d'environnement (.env.local)
- `DATABASE_URL` — Neon connection string
- `ADMIN_SECRET` — token Bearer pour les routes admin
- Ne jamais exposer ces variables côté client

## Fichier utilisateur
Non-développeur. Toujours fournir des commandes copy-paste. Explications courtes et claires en français.
