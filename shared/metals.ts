/**
 * Static reference metadata for the three supported metals. This is
 * presentation/reference config (color, symbol, element), not user data,
 * so it is safe to keep as static config on both sides rather than a DB
 * table. See shared/types.ts for the note on why this isn't imported
 * directly by /web or /server.
 */

export const G_PER_OZ = 31.1034768;

export const METAL_REFERENCE = {
  gold: { key: 'gold', label: 'Gold', symbol: 'APX-AU', element: 'Au', color: '#C8A253' },
  silver: { key: 'silver', label: 'Silver', symbol: 'APX-AG', element: 'Ag', color: '#A9B2BA' },
  platinum: { key: 'platinum', label: 'Platinum', symbol: 'APX-PT', element: 'Pt', color: '#DCE3E8' },
} as const;

export const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  mint: 'Mint',
  burn: 'Burn',
  transfer: 'Transfer',
  redemption: 'Redemption',
  deposit: 'Custody deposit',
};
