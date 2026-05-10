import type { Product } from '../../types';
import { HARAM_DOMAINS } from '../config';

/* Fake / placeholder URLs that must never pass */
const PLACEHOLDER_SIGNALS = [
  'placeholder', 'example.com', 'example.org', 'example.net',
  'test.com', 'localhost', '127.0.0.1', 'yoursite.com',
  'domain.com', 'mysite.com', 'website.com', 'url-here',
];

/* A valid affiliate URL must:
 *  1. Be a non-empty string
 *  2. Start with https:// (http:// is not acceptable — no secure channel)
 *  3. Contain a real hostname with a TLD (at least one dot, no IP-only)
 *  4. Not match any known placeholder pattern
 *  5. Not point to a known haram domain (principle: no_affiliate_no_display)
 */
export function hasValidAffiliateLink(product: Product): boolean {
  const raw = product.affiliateUrl;
  if (typeof raw !== 'string') return false;

  const url = raw.trim();
  if (!url) return false;
  if (url === '#') return false;

  const lower = url.toLowerCase();

  // Must be HTTPS
  if (!lower.startsWith('https://')) return false;

  // Placeholder / fake URL check
  if (PLACEHOLDER_SIGNALS.some((sig) => lower.includes(sig))) return false;

  // Parse & validate structure
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();

  // Must have at least one dot in the hostname (real TLD)
  if (!hostname.includes('.')) return false;

  // Must not be an IP address
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return false;

  // Must not point to a known haram domain
  if (HARAM_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
    return false;
  }

  return true;
}
