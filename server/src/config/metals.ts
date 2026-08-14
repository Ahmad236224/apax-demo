import type { MetalKey } from '../types';

export const G_PER_OZ = 31.1034768;

/**
 * Static reference config per metal. Spot price is a placeholder here —
 * there is no oracle/blockchain layer in this build (explicitly out of
 * scope), so pricing is a fixed stand-in a real deployment would replace
 * with a live spot feed.
 */
export const METAL_REFERENCE: Record<
  MetalKey,
  { label: string; symbol: string; fineness: string; spotUsdPerOz: number }
> = {
  gold: { label: 'Gold', symbol: 'APX-AU', fineness: '999.9', spotUsdPerOz: 2342.5 },
  silver: { label: 'Silver', symbol: 'APX-AG', fineness: '999.0', spotUsdPerOz: 27.85 },
  platinum: { label: 'Platinum', symbol: 'APX-PT', fineness: '999.5', spotUsdPerOz: 1024.3 },
};

export function gramsToUsd(asset: MetalKey, grams: number): number {
  const oz = grams / G_PER_OZ;
  return oz * METAL_REFERENCE[asset].spotUsdPerOz;
}
