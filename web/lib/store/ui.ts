import { create } from 'zustand';
import type { MetalKey, RedemptionMethod, TransactionStatus, TransactionType } from '../types';

/** Demo-only view toggle carried over from the original prototype's "State
 * preview" panel — lets the dashboard demonstrate loading/empty/error/gated
 * states on demand instead of only whatever the live API happens to return. */
export type ViewState = 'live' | 'loading' | 'empty' | 'error' | 'gated' | 'pending';

interface ViewStore {
  view: ViewState;
  setView: (view: ViewState) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  view: 'live',
  setView: (view) => set({ view }),
}));

interface BuyStore {
  step: 1 | 2 | 3 | 4;
  asset: MetalKey;
  weightGrams: string;
  setAsset: (asset: MetalKey) => void;
  setWeightGrams: (v: string) => void;
  toReview: () => void;
  toPending: () => void;
  toReceipt: () => void;
  back: () => void;
  reset: () => void;
}

export const useBuyStore = create<BuyStore>((set) => ({
  step: 1,
  asset: 'gold',
  weightGrams: '10',
  setAsset: (asset) => set({ asset }),
  setWeightGrams: (weightGrams) => set({ weightGrams }),
  toReview: () => set({ step: 2 }),
  toPending: () => set({ step: 3 }),
  toReceipt: () => set({ step: 4 }),
  back: () => set((s) => ({ step: Math.max(1, s.step - 1) as BuyStore['step'] })),
  reset: () => set({ step: 1, weightGrams: '10' }),
}));

interface RedeemStore {
  step: 1 | 2 | 3;
  asset: MetalKey;
  method: RedemptionMethod;
  grams: string;
  setAsset: (asset: MetalKey) => void;
  setMethod: (m: RedemptionMethod) => void;
  setGrams: (v: string) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
}

export const useRedeemStore = create<RedeemStore>((set) => ({
  step: 1,
  asset: 'gold',
  method: 'delivery',
  grams: '10',
  setAsset: (asset) => set({ asset }),
  setMethod: (method) => set({ method }),
  setGrams: (grams) => set({ grams }),
  next: () => set((s) => ({ step: Math.min(3, s.step + 1) as RedeemStore['step'] })),
  back: () => set((s) => ({ step: Math.max(1, s.step - 1) as RedeemStore['step'] })),
  reset: () => set({ step: 1, grams: '10' }),
}));

interface ActivityFilterStore {
  asset: MetalKey | 'all';
  type: TransactionType | 'all';
  status: TransactionStatus | 'all';
  page: number;
  setAsset: (v: MetalKey | 'all') => void;
  setType: (v: TransactionType | 'all') => void;
  setStatus: (v: TransactionStatus | 'all') => void;
  setPage: (v: number) => void;
  clear: () => void;
}

export const useActivityFilterStore = create<ActivityFilterStore>((set) => ({
  asset: 'all',
  type: 'all',
  status: 'all',
  page: 1,
  setAsset: (asset) => set({ asset, page: 1 }),
  setType: (type) => set({ type, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  clear: () => set({ asset: 'all', type: 'all', status: 'all', page: 1 }),
}));

interface ObligationStore {
  periodMonths: number;
  tier: 'standard' | 'institutional';
  setPeriodMonths: (v: number) => void;
  setTier: (v: 'standard' | 'institutional') => void;
}

export const useObligationStore = create<ObligationStore>((set) => ({
  periodMonths: 12,
  tier: 'standard',
  setPeriodMonths: (periodMonths) => set({ periodMonths }),
  setTier: (tier) => set({ tier }),
}));
