import { Client } from "@neondatabase/serverless";
const c = new Client(process.env.DATABASE_URL);
async function q(sql, p=[]) { return c.query(sql, p); }
async function main() {
  await c.connect();
  await q(`DELETE FROM "AffiliateClick"`);
  await q(`DELETE FROM "Product"`);
  await q(`DELETE FROM "Category"`);

  const cats = [
    ["tech",    "Tech & High-Tech",       "Smartphones, laptops, accessoires audio et gadgets sélectionnés.", "⚡"],
    ["mode",    "Mode & Style",            "Pièces intemporelles et tendances saisonnières à prix intelligent.", "✦"],
    ["maison",  "Maison & Déco",           "Mobilier, luminaires et objets déco pour intérieurs soignés.", "◈"],
    ["sport",   "Sport & Bien-être",       "Équipements, nutrition et accessoires bien-être validés.", "◎"],
    ["voyage",  "Voyage & Loisirs",        "Bagages, accessoires voyage et expériences à saisir.", "◇"],
    ["cuisine", "Cuisine & Épicerie fine", "Ustensiles, machines et produits pour cuisiniers exigeants.", "◉"],
  ];
  const ids = {};
  for (const [slug, name, desc, icon] of cats) {
    const id = "c" + Math.random().toString(36).slice(2,11) + Date.now().toString(36);
    await q(`INSERT INTO "Category" ("id","slug","name","description","icon","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,NOW(),NOW())`, [id, slug, name, desc, icon]);
    ids[slug] = id;
  }
  console.log("✓ Catégories OK");

  const prods = [
    { slug:"casque-audio-premium",   name:"Casque Audio Premium",          desc:"Qualité audio exceptionnelle, réduction de bruit active, 30h d'autonomie.", short:"Réduction de bruit active · 30h autonomie · Codec aptX HD", cat:"tech",    img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", price:249, orig:349, badges:[{label:"Tendance",variant:"trending"},{label:"Top rapport Q/P",variant:"top-value"}], q:9, v:9, t:95, tags:["audio","sans-fil","nomade"], feat:true },
    { slug:"montre-connectee-sport", name:"Montre Connectée Sport",         desc:"GPS intégré, suivi santé avancé, étanchéité 5 ATM. Design sobre et premium.", short:"GPS · Suivi santé · 14 jours autonomie", cat:"tech",    img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", price:199, orig:279, badges:[{label:"Promo",variant:"promo"}], q:8, v:9, t:82, tags:["sport","santé","connecté"], feat:true },
    { slug:"veste-mi-saison",        name:"Veste Mi-Saison Premium",        desc:"Coupe structurée, matière technique déperlante, fabrication éco-responsable.", short:"Coupe structurée · Déperlant · Éco-responsable", cat:"mode",    img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", price:139, orig:189, badges:[{label:"Nouveau",variant:"new"}], q:8, v:8, t:70, tags:["mode","veste","éco"], feat:true },
    { slug:"lampe-architecte",       name:"Lampe Architecte Design",        desc:"Bras articulé, lumière froide/chaude, variateur intégré. Fabrication européenne.", short:"LED 3 températures · Bras articulé · 15W", cat:"maison",  img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80", price:89,  orig:null, badges:[{label:"Top rapport Q/P",variant:"top-value"}], q:8, v:10, t:65, tags:["déco","bureau","lumière"], feat:false },
    { slug:"tapis-yoga-pro",         name:"Tapis de Yoga Professionnel",    desc:"Épaisseur 6mm, grip naturel, matière recyclée, sangle incluse.", short:"6mm · Grip naturel · Matière recyclée", cat:"sport",   img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", price:59,  orig:79,   badges:[{label:"Tendance",variant:"trending"}], q:9, v:9, t:88, tags:["yoga","bien-être","sport"], feat:false },
    { slug:"cafetiere-pour-over",    name:"Cafetière Pour-Over Signature",  desc:"Verre borosilicate, filtre réutilisable, capacité 600ml.", short:"Verre borosilicate · Filtre réutilisable · 600ml", cat:"cuisine", img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", price:44,  orig:null, badges:[{label:"Exclusif",variant:"exclusive"}], q:9, v:10, t:72, tags:["café","cuisine","lifestyle"], feat:false },
  ];
  for (const p of prods) {
    const id = "c" + Math.random().toString(36).slice(2,11) + Date.now().toString(36);
    const tagArr = "{" + p.tags.map(t => `"${t}"`).join(",") + "}";
    await q(`INSERT INTO "Product" ("id","slug","name","description","shortDescription","categoryId","imageUrl","price","originalPrice","currency","affiliateUrl","sourceName","sourceDomain","badges","qualityScore","valueScore","trendingScore","halalStatus","tags","isAvailable","featured","lastUpdated","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'EUR','#','Amazon','amazon.fr',$10::jsonb,$11,$12,$13,'allowed',$14::text[],$15,$16,NOW(),NOW(),NOW())`,
      [id, p.slug, p.name, p.desc, p.short, ids[p.cat], p.img, p.price, p.orig, JSON.stringify(p.badges), p.q, p.v, p.t, tagArr, true, p.feat]);
    console.log("✓", p.name);
  }
  await c.end();
  console.log("\n✅ Re-seed UTF-8 terminé !");
}
main().catch(console.error);