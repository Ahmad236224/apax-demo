export type MetalKey = 'gold' | 'silver' | 'platinum';

export type TransactionType = 'mint' | 'burn' | 'transfer' | 'redemption' | 'deposit';
export type TransactionStatus = 'confirmed' | 'pending' | 'failed' | 'cancelled';
export type RedemptionMethod = 'delivery' | 'settlement';
export type ReserveStatus = 'matched' | 'discrepancy';
export type KycStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  fullName: string;
  email: string;
  kycStatus: KycStatus;
  walletAddress?: string;
  createdAt: string;
}

export interface Holding {
  id: string;
  asset: MetalKey;
  grams: number;
  custodian: string;
  fineness: string;
  form: string;
  barSerials: string[];
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  asset: MetalKey;
  quantityGrams: number;
  valueUsd: number;
  status: TransactionStatus;
  reference: string;
  redemptionMethod?: RedemptionMethod;
  createdAt: string;
}

export interface ReserveAttestation {
  id: string;
  asset: MetalKey;
  mintedSupplyGrams: number;
  auditedReserveGrams: number;
  auditor: string;
  periodEnd: string;
  status: ReserveStatus;
}

export interface AuditDocument {
  id: string;
  ref: string;
  auditor: string;
  scope: string;
  periodLabel: string;
  issuedAt: string;
  statusLabel: string;
}

export interface Custodian {
  id: string;
  name: string;
  city: string;
  licence: string;
  holds: string;
  segregation: string;
  insurer: string;
}
