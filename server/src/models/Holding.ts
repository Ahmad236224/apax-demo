import { Schema, model, Types } from 'mongoose';
import type { MetalKey } from '../types';

export interface HoldingDoc {
  userId: Types.ObjectId;
  asset: MetalKey;
  grams: number;
  custodian: string;
  fineness: string;
  form: string;
  barSerials: string[];
  updatedAt: Date;
}

const holdingSchema = new Schema<HoldingDoc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  asset: { type: String, enum: ['gold', 'silver', 'platinum'], required: true },
  grams: { type: Number, required: true, min: 0 },
  custodian: { type: String, required: true },
  fineness: { type: String, required: true },
  form: { type: String, required: true },
  barSerials: { type: [String], default: [] },
  updatedAt: { type: Date, default: () => new Date() },
});

// A user has at most one holding row per metal; buy/redeem update grams in place.
holdingSchema.index({ userId: 1, asset: 1 }, { unique: true });

export const Holding = model<HoldingDoc>('Holding', holdingSchema);
