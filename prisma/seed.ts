import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  const tech = await prisma.category.upsert({
    where: { slug: "tech" },
    update: {},
    create: { slug: "tech", name: "Tech & High-Tech", description: "Smartphones, laptops, accessoires audio et gadgets sélectionnés.", icon: "⚡" },
  });
  const mode = await prisma.category.upsert({
    where: { slug: "mode" },
    update: {},
    create: { slug: "mode", name: "Mode & Style", description: "Pièces intemporelles et tendances saisonnières à prix intelligent.", icon: "✦" },
  });
  const maison = await prisma.category.upsert({
    where: { slug: "maison" },
    update: {},
    create: { slug: "maison", name: "Maison & Déco", description: "Mobilier, luminaires et objets déco pour intérieurs soignés.", icon: "◈" },
  });
  const sport = await prisma.category.upsert({
    where: { slug: "sport" },
    update: {},
    create: { slug: "sport", name: "Sport & Bien-être", description: "Équipements, nutrition et accessoires bien-être validés.", icon: "◎" },
  });
  const voyage = await prisma.category.upsert({
    where: { slug: "voyage" },
    update: {},
    create: { slug: "voyage", name: "Voyage & Loisirs", description: "Bagages, accessoires voyage et expériences à saisir.", icon: "◇" },
  });
  const cuisine = await prisma.category.upsert({
    where: { slug: "cuisine" },
    update: {},
    create: { slug: "cuisine", name: "Cuisine & Épicerie fine", description: "Ustensiles, machines et produits pour cuisiniers exigeants.", icon: "◉" },
  });

  // Products
  const productsData = [
    {
      slug: "casque-audio-premium",
      name: "Casque Audio Premium",
      description: "Qualité audio exceptionnelle, réduction de bruit active, 30h d'autonomie.",
      shortDescription: "Réduction de bruit active · 30h autonomie · Codec aptX HD",
      categoryId: tech.id,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      price: 249, originalPrice: 349, currency: "EUR",
      affiliateUrl: "#affiliate-link-placeholder",
      sourceName: "Amazon", sourceDomain: "amazon.fr",
      badges: [{ label: "Tendance", variant: "trending" }, { label: "Top rapport Q/P", variant: "top-value" }],
      qualityScore: 9, valueScore: 9, trendingScore: 95,
      tags: ["audio", "sans-fil", "nomade"], featured: true,
    },
    {
      slug: "montre-connectee-sport",
      name: "Montre Connectée Sport",
      description: "GPS intégré, suivi santé avancé, étanchéité 5 ATM. Design sobre et premium.",
      shortDescription: "GPS · Suivi santé · 14 jours autonomie",
      categoryId: tech.id,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      price: 199, originalPrice: 279, currency: "EUR",
      affiliateUrl: "#affiliate-link-placeholder",
      sourceName: "Amazon", sourceDomain: "amazon.fr",
      badges: [{ label: "Promo", variant: "promo" }],
      qualityScore: 8, valueScore: 9, trendingScore: 82,
      tags: ["sport", "santé", "connecté"], featured: true,
    },
    {
      slug: "veste-mi-saison",
      name: "Veste Mi-Saison Premium",
      description: "Coupe structurée, matière technique déperlante, fabrication éco-responsable.",
      shortDescription: "Coupe structurée · Déperlant · Éco-responsable",
      categoryId: mode.id,
      imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      price: 139, originalPrice: 189, currency: "EUR",
      affiliateUrl: "#affiliate-link-placeholder",
      sourceName: "Amazon", sourceDomain: "amazon.fr",
      badges: [{ label: "Nouveau", variant: "new" }],
      qualityScore: 8, valueScore: 8, trendingScore: 70,
      tags: ["mode", "veste", "éco"], featured: true,
    },
    {
      slug: "lampe-architecte",
      name: "Lampe Architecte Design",
      description: "Bras articulé, lumière froide/chaude, variateur intégré. Fabrication européenne.",
      shortDescription: "LED 3 températures · Bras articulé · 15W",
      categoryId: maison.id,
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      price: 89, currency: "EUR",
      affiliateUrl: "#affiliate-link-placeholder",
      sourceName: "Amazon", sourceDomain: "amazon.fr",
      badges: [{ label: "Top rapport Q/P", variant: "top-value" }],
      qualityScore: 8, valueScore: 10, trendingScore: 65,
      tags: ["déco", "bureau", "lumière"], featured: false,
    },
    {
      slug: "tapis-yoga-pro",
      name: "Tapis de Yoga Professionnel",
      description: "Épaisseur 6mm, grip naturel, matière recyclée, sangle incluse.",
      shortDescription: "6mm · Grip naturel · Matière recyclée",
      categoryId: sport.id,
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      price: 59, originalPrice: 79, currency: "EUR",
      affiliateUrl: "#affiliate-link-placeholder",
      sourceName: "Amazon", sourceDomain: "amazon.fr",
      badges: [{ label: "Tendance", variant: "trending" }],
      qualityScore: 9, valueScore: 9, trendingScore: 88,
      tags: ["yoga", "bien-être", "sport"], featured: false,
    },
    {
      slug: "cafetiere-pour-over",
      name: "Cafetière Pour-Over Signature",
      description: "Verre borosilicate, filtre réutilisable, capacité 600ml.",
      shortDescription: "Verre borosilicate · Filtre réutilisable · 600ml",
      categoryId: cuisine.id,
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      price: 44, currency: "EUR",
      affiliateUrl: "#affiliate-link-placeholder",
      sourceName: "Amazon", sourceDomain: "amazon.fr",
      badges: [{ label: "Exclusif", variant: "exclusive" }],
      qualityScore: 9, valueScore: 10, trendingScore: 72,
      tags: ["café", "cuisine", "lifestyle"], featured: false,
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, halalStatus: "allowed", isAvailable: true },
    });
  }

  console.log("✅ Seed terminé — 6 catégories, 6 produits insérés.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });