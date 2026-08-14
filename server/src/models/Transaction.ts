import { Schema, model, Types } from 'mongoose';
import type { MetalKey, RedemptionMethod, TransactionStatus, TransactionType } from '../types';

export interface TransactionDoc {
  userId: Types.ObjectId;
  type: TransactionType;
  asset: MetalKey;
  quantityGrams: number;
  valueUsd: number;
  status: TransactionStatus;
  reference: string;
  redemptionMethod?: RedemptionMethod;
  createdAt: Date;
}

const transactionSchema = new Schema<TransactionDoc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['mint', 'burn', 'transfer', 'redemption', 'deposit'], required: true },
  asset: { type: String, enum: ['gold', 'silver', 'platinum'], required: true },
  quantityGrams: { type: Number, required: true, min: 0 },
  valueUsd: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'failed', 'cancelled'],
    default: 'pending',
  },
  reference: { type: String, required: true },
  redemptionMethod: { type: String, enum: ['delivery', 'settlement'] },
  createdAt: { type: Date, default: () => new Date(), index: true },
});

export const Transaction = model<TransactionDoc>('Transaction', transactionSchema);
