import type { MetalKey } from './types';

export const G_PER_OZ = 31.1034768;

export const METAL_REFERENCE: Record<
  MetalKey,
  { label: string; symbol: string; element: string; color: string; spotUsdPerOz: number; dailyChangePct: number }
> = {
  gold: { label: 'Gold', symbol: 'APX-AU', element: 'Au', color: '#C8A253', spotUsdPerOz: 2342.5, dailyChangePct: 0.42 },
  silver: { label: 'Silver', symbol: 'APX-AG', element: 'Ag', color: '#A9B2BA', spotUsdPerOz: 27.85, dailyChangePct: 0.18 },
  platinum: { label: 'Platinum', symbol: 'APX-PT', element: 'Pt', color: '#DCE3E8', spotUsdPerOz: 1024.3, dailyChangePct: -0.31 },
};

export const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  mint: 'Mint',
  burn: 'Burn',
  transfer: 'Transfer',
  redemption: 'Redemption',
  deposit: 'Custody deposit',
};

export const STATUS_COLOR: Record<string, string> = {
  confirmed: '#5E9C7B',
  pending: '#C8A253',
  failed: '#B4685E',
  cancelled: '#8B9199',
};

export function gramsToUsd(asset: MetalKey, grams: number): number {
  return (grams / G_PER_OZ) * METAL_REFERENCE[asset].spotUsdPerOz;
}
