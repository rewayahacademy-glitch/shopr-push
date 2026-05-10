import type { Product } from '../../types';

/* Hard: these phrases unambiguously signal a forbidden financial product */
const RIBA_HARD = [
  'riba', 'usury', 'usure', 'payday loan', 'prêt usuraire',
  'high-interest loan', 'interest-bearing loan', 'apr loan',
  'loan with interest', 'credit with interest', 'loan shark',
  'prêteur usuraire', 'microcredit avec intérêts', 'crédit à taux élevé',
  'taux annuel effectif global', 'taeg élevé', 'crédit revolving',
  'prêt à la consommation avec intérêts', 'crédit auto avec intérêts',
];

/* Soft: interest exists but may be contextual (e.g. "point of interest") */
const RIBA_SOFT = [
  'interest rate', 'taux d\'intérêt', 'crédit renouvelable',
  'pay later with interest', 'paiement avec intérêts',
  'buy now pay later interest', 'financement avec intérêts',
  'bnpl interest', 'prêt à intérêts', 'mensualités avec intérêts',
  'apr %', 'annual percentage rate',
];

/* Gharar: excessive uncertainty / mystery — route to review */
const GHARAR_HARD = [
  'mystery box', 'boîte mystère', 'surprise box', 'coffret surprise',
  'blind box', 'lucky dip', 'random product', 'produit aléatoire',
  'loot box', 'gacha', 'mystery item', 'surprise item',
  'grab bag', 'loot crate', 'boîte surprise aléatoire',
];

/* Maysir: gambling / chance-based gain — forbidden */
const MAYSIR_HARD = [
  'casino', 'gambling', 'betting', 'lottery', 'wager', 'jackpot',
  'slot machine', 'paris sportifs', 'loterie', 'grattage', 'tirage au sort payant',
  'jeux de hasard', 'machine à sous', 'roulette casino', 'blackjack casino',
  'poker argent réel', 'sports betting', 'bookmaker', 'mise sportive',
  'tierce', 'quarté', 'quinté', 'pmu jeux', 'scratch card',
];

/* Fraud / counterfeit risk — forbidden */
const FRAUD_HARD = [
  'counterfeit', 'contrefaçon', 'fake product', 'knock-off', 'faux produit',
  'replica marque', 'bootleg', 'unauthorized replica',
  'imitation marque', 'copie illicite', 'produit copié',
];

export interface FinanceRiskResult {
  ribaDetected: boolean;
  gharar: boolean;
  maysir: boolean;
  fraud: boolean;
  status: 'forbidden' | 'needs_review' | 'allowed';
  score: number;   // 0–1
  reasons: string[];
}

export function assessFinanceRisk(product: Product): FinanceRiskResult {
  const text = [
    product.name,
    product.description,
    product.shortDescription ?? '',
    ...product.tags,
  ].join(' ').toLowerCase();

  const ribaDetected = RIBA_HARD.some((kw) => text.includes(kw));
  const ribaSoft      = !ribaDetected && RIBA_SOFT.some((kw) => text.includes(kw));
  const gharar        = GHARAR_HARD.some((kw) => text.includes(kw));
  const maysir        = MAYSIR_HARD.some((kw) => text.includes(kw));
  const fraud         = FRAUD_HARD.some((kw) => text.includes(kw));

  const reasons: string[] = [];
  if (ribaDetected) reasons.push('riba_detected');
  if (ribaSoft)     reasons.push('riba_possible');
  if (gharar)       reasons.push('gharar_detected');
  if (maysir)       reasons.push('maysir_detected');
  if (fraud)        reasons.push('fraud_risk');

  if (ribaDetected || maysir || fraud) {
    return { ribaDetected, gharar, maysir, fraud, status: 'forbidden', score: 1, reasons };
  }

  if (gharar || ribaSoft) {
    return { ribaDetected: false, gharar, maysir: false, fraud: false, status: 'needs_review', score: 0.6, reasons };
  }

  return { ribaDetected: false, gharar: false, maysir: false, fraud: false, status: 'allowed', score: 0, reasons: [] };
}
