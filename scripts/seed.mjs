import { Client } from "@neondatabase/serverless";

const client = new Client(process.env.DATABASE_URL);

function cuid() {
  return "c" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

async function upsertCategory(slug, name, description, icon) {
  const id = cuid();
  const res = await client.query(
    `INSERT INTO "Category" ("id","slug","name","description","icon","createdAt","updatedAt")
     VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
     ON CONFLICT ("slug") DO UPDATE SET "name"=EXCLUDED."name"
     RETURNING "id"`,
    [id, slug, name, description, icon]
  );
  return res.rows[0].id;
}

async function upsertProduct(p) {
  const id = cuid();
  await client.query(
    `INSERT INTO "Product" (
      "id","slug","name","description","shortDescription","categoryId",
      "imageUrl","price","originalPrice","currency","affiliateUrl",
      "sourceName","sourceDomain","badges","qualityScore","valueScore",
      "trendingScore","halalStatus","tags","isAvailable","featured",
      "lastUpdated","createdAt","updatedAt"
     ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15,$16,$17,$18,$19::text[],$20,$21,NOW(),NOW(),NOW()
     ) ON CONFLICT ("slug") DO NOTHING`,
    [
      id, p.slug, p.name, p.description, p.shortDescription, p.categoryId,
      p.imageUrl, p.price, p.originalPrice ?? null, "EUR", p.affiliateUrl,
      p.sourceName, p.sourceDomain, JSON.stringify(p.badges), p.qualityScore,
      p.valueScore, p.trendingScore, "allowed", `{${p.tags.map(t => `"${t}"`).join(",")}}`,
      true, p.featured
    ]
  );
  console.log("OK  -", p.name);
}

async function main() {
  console.log("Seeding Neon...\n");
  await client.connect();

  const tech    = await upsertCategory("tech",    "Tech & High-Tech",       "Smartphones, laptops, accessoires audio et gadgets sélectionnés.", "⚡");
  const mode    = await upsertCategory("mode",    "Mode & Style",            "Pièces intemporelles et tendances saisonnières à prix intelligent.", "✦");
  const maison  = await upsertCategory("maison",  "Maison & Déco",           "Mobilier, luminaires et objets déco pour intérieurs soignés.", "◈");
  const sport   = await upsertCategory("sport",   "Sport & Bien-être",       "Équipements, nutrition et accessoires bien-être validés.", "◎");
  await upsertCategory("voyage",  "Voyage & Loisirs",        "Bagages, accessoires voyage et expériences à saisir.", "◇");
  const cuisine = await upsertCategory("cuisine", "Cuisine & Épicerie fine", "Ustensiles, machines et produits pour cuisiniers exigeants.", "◉");

  console.log("✓ 6 catégories insérées\n");

  const products = [
    { slug:"casque-audio-premium",    name:"Casque Audio Premium",         description:"Qualité audio exceptionnelle, réduction de bruit active, 30h d'autonomie.",    shortDescription:"Réduction de bruit active · 30h autonomie · Codec aptX HD", categoryId:tech,   imageUrl:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", price:249, originalPrice:349, affiliateUrl:"#", sourceName:"Amazon", sourceDomain:"amazon.fr", badges:[{label:"Tendance",variant:"trending"},{label:"Top rapport Q/P",variant:"top-value"}], qualityScore:9, valueScore:9, trendingScore:95, tags:["audio","sans-fil","nomade"], featured:true },
    { slug:"montre-connectee-sport",  name:"Montre Connectée Sport",       description:"GPS intégré, suivi santé avancé, étanchéité 5 ATM. Design sobre et premium.", shortDescription:"GPS · Suivi santé · 14 jours autonomie",                     categoryId:tech,   imageUrl:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", price:199, originalPrice:279, affiliateUrl:"#", sourceName:"Amazon", sourceDomain:"amazon.fr", badges:[{label:"Promo",variant:"promo"}], qualityScore:8, valueScore:9, trendingScore:82, tags:["sport","santé","connecté"], featured:true },
    { slug:"veste-mi-saison",         name:"Veste Mi-Saison Premium",      description:"Coupe structurée, matière technique déperlante, fabrication éco-responsable.", shortDescription:"Coupe structurée · Déperlant · Éco-responsable",              categoryId:mode,   imageUrl:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", price:139, originalPrice:189, affiliateUrl:"#", sourceName:"Amazon", sourceDomain:"amazon.fr", badges:[{label:"Nouveau",variant:"new"}], qualityScore:8, valueScore:8, trendingScore:70, tags:["mode","veste","éco"], featured:true },
    { slug:"lampe-architecte",        name:"Lampe Architecte Design",      description:"Bras articulé, lumière froide/chaude, variateur intégré. Fabrication européenne.", shortDescription:"LED 3 températures · Bras articulé · 15W",               categoryId:maison, imageUrl:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80", price:89,  originalPrice:null, affiliateUrl:"#", sourceName:"Amazon", sourceDomain:"amazon.fr", badges:[{label:"Top rapport Q/P",variant:"top-value"}], qualityScore:8, valueScore:10, trendingScore:65, tags:["déco","bureau","lumière"], featured:false },
    { slug:"tapis-yoga-pro",          name:"Tapis de Yoga Professionnel",  description:"Épaisseur 6mm, grip naturel, matière recyclée, sangle incluse.",                shortDescription:"6mm · Grip naturel · Matière recyclée",                      categoryId:sport,  imageUrl:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", price:59,  originalPrice:79,  affiliateUrl:"#", sourceName:"Amazon", sourceDomain:"amazon.fr", badges:[{label:"Tendance",variant:"trending"}], qualityScore:9, valueScore:9, trendingScore:88, tags:["yoga","bien-être","sport"], featured:false },
    { slug:"cafetiere-pour-over",     name:"Cafetière Pour-Over Signature",description:"Verre borosilicate, filtre réutilisable, capacité 600ml.",                       shortDescription:"Verre borosilicate · Filtre réutilisable · 600ml",            categoryId:cuisine,imageUrl:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", price:44,  originalPrice:null, affiliateUrl:"#", sourceName:"Amazon", sourceDomain:"amazon.fr", badges:[{label:"Exclusif",variant:"exclusive"}], qualityScore:9, valueScore:10, trendingScore:72, tags:["café","cuisine","lifestyle"], featured:false },
  ];

  for (const p of products) await upsertProduct(p);

  await client.end();
  console.log("\n✅ Seed terminé — 6 catégories + 6 produits dans Neon !");
}

main().catch(console.error);