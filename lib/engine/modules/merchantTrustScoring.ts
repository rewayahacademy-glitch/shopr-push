import type { Product } from '../../types';
import { TRUSTED_MERCHANTS } from '../config';

export function scoreMerchantTrust(product: Product): number {
  const name = product.source?.name?.toLowerCase() ?? '';
  const domain = product.source?.domain?.toLowerCase() ?? '';

  if (!name && !domain) return 0.2;

  const isTrusted = TRUSTED_MERCHANTS.some(
    (m) => name.includes(m) || domain.includes(m),
  );

  return isTrusted ? 1.0 : 0.5;
}
