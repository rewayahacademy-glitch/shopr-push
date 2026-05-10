/* Scoring weights — must sum to 1 */
export const SCORE_WEIGHTS = {
  affiliate:     0.25,
  compliance:    0.30,
  qualityPrice:  0.20,
  merchantTrust: 0.15,
  trend:         0.07,
  seasonal:      0.03,
} as const;

/* Maximum products in the final shortlist */
export const SHORTLIST_MAX = 12;

/* Hard keyword blacklist — any match → forbidden */
export const HALAL_KEYWORDS = {
  forbidden: [
    // Alcohol — FR / EN / translittéré arabe
    'alcool', 'alcohol', 'wine', 'vin', 'beer', 'bière', 'vodka', 'rum', 'whisky',
    'champagne', 'spirits', 'liqueur', 'brandy', 'gin', 'tequila', 'sake',
    'whiskey', 'porto', 'rhum', 'prosecco', 'vermouth', 'khamr', 'nabidh',
    'malt beverage', 'boisson alcoolisée', 'boisson alcoolique', 'bière alcoolisée',
    'vin rouge', 'vin blanc', 'vin rosé', 'apéritif', 'digestif', 'cocktail alcool',
    'hard seltzer', 'hard cider', 'sidra alcool', 'alcopop',
    // Pork & derivatives
    'pork', 'porc', 'jambon', 'bacon', 'cochon', 'prosciutto', 'saucisson',
    'lard', 'mortadelle', 'rillette', 'boudin', 'chipolata porc', 'chorizo',
    'pancetta', 'pepperoni', 'coppa', 'salami', 'andouille', 'andouillette',
    'pâté de porc', 'saindoux', 'graisse de porc', 'couenne',
    'porc haché', 'viande porcine', 'saucisse de porc', 'jambon cru',
    'jambon blanc', 'jambon sec', 'ham', 'swine', 'pig', 'pork gelatin',
    // Gambling
    'gambling', 'casino', 'paris sportifs', 'betting', 'pari sportif', 'wager',
    'lottery', 'lotterie', 'loterie', 'grattage', 'slot machine', 'jeu argent',
    'jeux de hasard', 'machine à sous', 'roulette casino', 'blackjack',
    'poker argent réel', 'poker money', 'sports betting', 'bookmaker',
    'mise sportive', 'cote sportive', 'tierce', 'quarté', 'quinté',
    // Adult
    'pornography', 'adult content', 'sexe explicite', 'explicit sexual', 'erotic',
    'érotique', 'porn', 'porno', 'x-rated', 'adults only', 'adult film',
    'sex toy', 'sextoy', 'vibrator', 'godemichet', 'dildo', 'fetish sexual',
    // Tobacco / drugs / vaping
    'tobacco', 'cigarette', 'cigare', 'nicotine', 'cannabis', 'marijuana',
    'drogue', 'drug', 'intoxicant', 'tabac', 'chicha', 'narguilé', 'hookah',
    'e-cigarette', 'cigarette électronique', 'vape juice', 'e-liquid', 'vaping',
    'heroin', 'héroïne', 'cocaine', 'cocaïne', 'ecstasy', 'mdma', 'lsd',
    'kratom', 'khat', 'qat', 'shisha tobacco', 'pipe tobacco', 'snuff',
    // Non-halal meat / slaughter
    'non-halal', 'non halal', 'viande non halal', 'abattu sans bismillah',
    // Riba — hard signals
    'riba', 'usury', 'usure', 'payday loan', 'prêt usuraire', 'high-interest loan',
    'loan shark', 'prêteur usuraire',
    // Fraud
    'counterfeit', 'contrefaçon', 'fake product', 'knock-off', 'faux produit',
    'replica marque', 'bootleg', 'unauthorized replica',
    // Shirk / idols / forbidden religious items
    'idol worship', 'shirk', 'croix votive', 'statue deity', 'statue dieu',
    'offrande idol', 'temple idol',
    // Non-halal gelatin — hard signals
    'gelatin porcine', 'gélatine porcine', 'pork gelatin', 'pig gelatin',
  ],
  doubtful: [
    // Food additives (E numbers, animal derivatives — source unknown)
    'gélatine', 'gelatin', 'carmin', 'carmine', 'cochenille', 'e120', 'e441',
    'alcool dénaturé', 'parfum alcool', 'e904', 'e542', 'e631', 'e635',
    'extraits animaux', 'animal extract', 'animal rennet', 'présure animale',
    'whey non-halal', 'albumine', 'albumin',
    // Finance — soft signals (contextual)
    'interest rate', 'taux d\'intérêt', 'crédit renouvelable',
    'pay later with interest', 'paiement avec intérêts', 'bnpl interest',
    'financement avec intérêts', 'prêt à intérêts',
    // Gharar — uncertainty / mystery purchases
    'mystery box', 'boîte mystère', 'surprise box', 'coffret surprise',
    'blind box', 'lucky dip', 'random product', 'produit aléatoire',
    'mystery item', 'surprise item', 'grab bag', 'loot crate',
  ],
} as const;

/* Spiritual risk keywords (dedicated engine) */
export const SPIRITUAL_KEYWORDS = {
  /* Hard reject — product is clearly a forbidden spiritual item */
  forbidden: [
    'amulet', 'amulette', 'talisman', 'talismanique', 'gri-gri', 'grigri',
    'lucky charm', 'porte-bonheur magique', 'bonne chance charm',
    'pierre magique', 'magic stone', 'pierres magiques',
    'energy healing crystal', 'crystal healing', 'guérison cristal',
    'chakra balancing', 'chakras balancing', 'reiki healing', 'reiki kit',
    'cosmic alignment', 'alignement cosmique', 'cosmic energy',
    'manifestation ritual', 'rituel manifestation', 'law of attraction ritual',
    'occult', 'occulte', 'magie noire', 'black magic', 'dark magic',
    'spiritual cleansing', 'nettoyage spirituel', 'spiritual purification kit',
    'horoscope kit', 'astrology kit', 'tarot card', 'carte tarot', 'oracle cards',
    'divination', 'voyance', 'fortune telling', 'cartomancie',
    'spell kit', 'sortilège', 'envoûtement', 'sorcery',
    'voodoo', 'vaudou', 'witchcraft', 'sorcellerie',
    'evil eye repeller magic', 'superstition charm',
    // Numérologie / astrologie — outils de divination
    'numerology kit', 'numérologie', 'birth chart kit', 'astral chart',
    'horoscope reading', 'horoscope personnalisé', 'astrologie lecture',
    'zodiac reading', 'palmistry', 'chiromancie', 'crystal ball',
    'boule de cristal', 'pendulum divination', 'pendule divinatoire',
    'ouija', 'ouija board', 'planche ouija', 'spirit board',
    'séance kit', 'ghost hunting kit', 'medium kit',
    // Invocations / rituels interdits
    'ritual candle magic', 'candle spell', 'bougie envoûtement',
    'love potion', 'potion amour', 'philtre amour',
    'hex kit', 'curse kit', 'malediction kit',
    'satanic', 'satanique', 'pentagrame', 'pentagram', 'inverted cross',
    'croix inversée', 'lucifer', 'demon summoning',
  ],
  /* Soft — send to review; secular use might be fine */
  review: [
    'crystal', 'cristal', 'healing stone', 'pierre de guérison',
    'meditation kit', 'mindfulness ritual', 'chakra bracelet', 'chakra necklace',
    'chakra pendant', 'chakra stone', 'chakra', 'chakras',
    'law of attraction', 'loi attraction', 'good luck stone', 'lucky stone',
    'protection bracelet', 'bracelet protection', 'energy stone', 'pierre énergie',
    'feng shui', 'reiki', 'manifestation', 'evil eye', 'mauvais oeil',
    'hamsa', 'nazar', 'dreamcatcher', 'attrape-rêves',
    'spiritual', 'spirituel', 'séance', 'médium',
    // Horoscope / zodiaque (usage décoratif possible — review)
    'horoscope', 'zodiac', 'astrologie', 'astrology', 'zodiac sign',
    'signe astrologique', 'birth sign', 'star sign',
    // Méditation / pleine conscience (usage physique possible)
    'meditation', 'méditation', 'mindfulness', 'pleine conscience',
    'singing bowl', 'bol tibétain', 'incense spiritual',
  ],
} as const;

/* Yoga policy — spiritual framing vs physical-only */
export const YOGA_KEYWORDS = {
  spiritual: [
    'yoga spiritual', 'yoga salvation', 'yoga ritual', 'yoga enlightenment',
    'yoga divine', 'spiritual yoga', 'yoga ceremony', 'yoga awakening',
    'kundalini awakening', 'yoga energy worship', 'yoga chakra healing',
    'pranayama spiritual', 'yoga liberation', 'yoga salvation',
  ],
  physical: [
    'yoga mat', 'yoga block', 'yoga strap', 'tapis yoga', 'yoga brick',
    'yoga pants', 'yoga leggings', 'yoga shorts', 'yoga outfit', 'yoga wear',
    'yoga bag', 'yoga towel', 'yoga wheel', 'yoga equipment', 'yoga props',
    'yoga bottle', 'yoga bolster', 'yoga cushion',
  ],
} as const;

/* Modesty risk keywords — text-based signals */
export const MODESTY_KEYWORDS = {
  /* Hard reject from text alone */
  forbidden: [
    'nude', 'nudité', 'nu intégral', 'topless', 'bottomless',
    'explicit lingerie', 'lingerie sexy provocante',
    'underwear model sexy', 'provocative model', 'erotic model',
    'sensual model', 'seductive photoshoot', 'barely there',
    'see-through sexy', 'transparent sexy',
    // Contenu clairement inapproprié
    'strip', 'striptease', 'lap dance', 'pole dance outfit sexy',
    'thong sexy', 'g-string sexy', 'micro bikini', 'pasties',
    'nipple cover sexy', 'body painting nude', 'body peinture nue',
    'naked', 'déshabillé', 'dénudé',
  ],
  /* Review — likely ok but needs human check */
  review: [
    'lingerie', 'sous-vêtements', 'underwear',
    'bikini', 'swimwear', 'maillot de bain', 'bra', 'soutien-gorge',
    'sexy', 'seductive', 'sensual', 'sensuel', 'provocant', 'suggestive',
    'bodysuit', 'body transparent', 'sheer top', 'see-through',
    'backless', 'strapless', 'low-cut', 'décolleté', 'body moulant',
    // Maillots et vêtements révélateurs
    'monokini', 'one-piece swimsuit', 'tankini', 'thong', 'string',
    'bralette', 'crop top très court', 'tube top', 'bandeau top',
    'mini jupe très courte', 'mini robe', 'hot pants', 'short très court',
    // Tenues de nuit et homewear révélateurs
    'nuisette', 'babydoll', 'chemise de nuit courte', 'pyjama sexy',
    'déshabillé', 'peignoir transparent',
  ],
} as const;

/* Category slugs that are unconditionally prohibited */
export const PROHIBITED_CATEGORIES = [
  'alcool', 'jeux-argent', 'adulte', 'tabac', 'gambling',
  'alcool-vin', 'paris-sportifs', 'adult', 'casino-en-ligne', 'vins-spiritueux',
  'cigarettes', 'tabac-cigarettes', 'vapotage', 'vape', 'e-cigarettes',
  'cannabis', 'cbd-thc', 'drugs', 'drogues',
  'porc', 'charcuterie-porc', 'pork-products',
  'pornographie', 'adult-content', 'erotic', 'erotique',
  'loterie', 'lottery', 'betting', 'paris',
  'usure', 'pret-usuraire', 'payday-loans',
  'occult', 'occulte', 'sorcellerie', 'magie-noire',
  'divination', 'voyance', 'astrologie-kit',
];

/* Known haram affiliate domains — products pointing to these are auto-rejected */
export const HARAM_DOMAINS = [
  // Alcool / spirits
  'wine.com', 'totalwine.com', 'drizly.com', 'vivino.com',
  'nicolas.com', 'lavinia.com', 'maison-du-whisky.fr',
  // Casinos / jeux d'argent
  'pokerstars.fr', 'winamax.fr', 'betclic.fr', 'pmu.fr',
  'unibet.fr', 'bwin.fr', 'zebet.fr', 'parionssport.lfdj.fr',
  // Adulte
  'pornhub.com', 'xvideos.com', 'youporn.com', 'redtube.com',
  'brazzers.com', 'myadultstore.fr', 'dorcel.com',
  // Tabac
  'philip-morris.fr', 'jti.com', 'altria.com',
];

/* Merchants with established reliability */
export const TRUSTED_MERCHANTS = [
  'amazon', 'fnac', 'cdiscount', 'darty', 'decathlon',
  'boulanger', 'ldlc', 'asos', 'zalando', 'manomano',
  'rakuten', 'veepee', 'rue du commerce', 'leroy merlin',
  'carrefour', 'auchan', 'leclerc', 'maisons du monde',
  'sephora', 'la redoute', 'mango', 'uniqlo', 'ikea',
];

/* Seasonal events with their active months and tag signals */
export const SEASONAL_EVENTS: Array<{
  name: string;
  tags: string[];
  monthStart: number;
  monthEnd: number;
  weight: number;
}> = [
  {
    name: 'Ramadan',
    tags: ['ramadan', 'iftar', 'suhoor', 'dattes', 'mosquée', 'jeûne', 'ramadan gift'],
    monthStart: 2, monthEnd: 4, weight: 1.4,
  },
  {
    name: 'Aïd',
    tags: ['eid', 'aïd', 'aid', 'eid gift', 'cadeau eid', 'fête islamique'],
    monthStart: 3, monthEnd: 5, weight: 1.3,
  },
  {
    name: 'Rentrée',
    tags: ['rentrée', 'scolaire', 'école', 'bureau', 'cartable', 'fournitures'],
    monthStart: 7, monthEnd: 9, weight: 1.2,
  },
  {
    name: 'Été',
    tags: ['été', 'vacances', 'plage', 'piscine', 'solaire', 'voyage'],
    monthStart: 5, monthEnd: 8, weight: 1.1,
  },
  {
    name: 'Hiver',
    tags: ['hiver', 'manteau', 'ski', 'chauffage', 'pull', 'froid'],
    monthStart: 11, monthEnd: 1, weight: 1.1,
  },
  {
    name: 'Noël',
    tags: ['cadeau', 'fête', 'décoration', 'gift'],
    monthStart: 11, monthEnd: 12, weight: 1.2,
  },
];
