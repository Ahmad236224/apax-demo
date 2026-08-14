import { Schema, model } from 'mongoose';
import type { MetalKey, ReserveStatus } from '../types';

export interface ReserveAttestationDoc {
  asset: MetalKey;
  mintedSupplyGrams: number;
  auditedReserveGrams: number;
  auditor: string;
  periodEnd: Date;
  status: ReserveStatus;
}

const reserveAttestationSchema = new Schema<ReserveAttestationDoc>({
  asset: { type: String, enum: ['gold', 'silver', 'platinum'], required: true, unique: true },
  mintedSupplyGrams: { type: Number, required: true },
  auditedReserveGrams: { type: Number, required: true },
  auditor: { type: String, required: true },
  periodEnd: { type: Date, required: true },
  status: { type: String, enum: ['matched', 'discrepancy'], default: 'matched' },
});

export const ReserveAttestation = model<ReserveAttestationDoc>(
  'ReserveAttestation',
  reserveAttestationSchema,
);
