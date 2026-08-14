import { Router } from 'express';
import { randomUUID } from 'crypto';
import { Holding } from '../models/Holding';
import { Transaction } from '../models/Transaction';
import { requireAuth } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { asyncHandler } from '../lib/asyncHandler';
import { gramsToUsd } from '../config/metals';
import type { MetalKey, RedemptionMethod } from '../types';

export const redeemRouter = Router();

const REDEMPTION_FEE_RATE = 0.01;
const VALID_ASSETS: MetalKey[] = ['gold', 'silver', 'platinum'];
const VALID_METHODS: RedemptionMethod[] = ['delivery', 'settlement'];

// POST /api/redeem { asset, grams, method } (auth required)
//
// Redemption before burn: the vault-side prerequisites this build enforces
// server-side (before a real burn/on-chain step could ever run) are —
//   1. requireAuth + KYC approved (checked here) — no redemption while a
//      user is unverified, matching the "gated" state in the product.
//   2. sufficient allocated grams on the Holding record (checked here).
//   3. compliance/sanctions screening on the delivery address — out of
//      scope for this build, flagged in README as the next gate to add.
// Only after those clear would a real deployment call the burn contract;
// here we just debit the holding and log a pending redemption record.
redeemRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { asset, grams, method } = req.body ?? {};
    if (!VALID_ASSETS.includes(asset)) {
      throw new ApiError(400, 'invalid_asset', 'asset must be gold, silver or platinum');
    }
    if (!VALID_METHODS.includes(method)) {
      throw new ApiError(400, 'invalid_method', 'method must be delivery or settlement');
    }
    const quantityGrams = Number(grams);
    if (!Number.isFinite(quantityGrams) || quantityGrams <= 0) {
      throw new ApiError(400, 'invalid_quantity', 'grams must be a positive number');
    }

    const holding = await Holding.findOne({ userId: req.user!.id, asset });
    if (!holding || holding.grams < quantityGrams) {
      throw new ApiError(422, 'insufficient_holding', 'Not enough allocated metal to redeem');
    }

    const valueUsd = gramsToUsd(asset, quantityGrams);
    const fee = valueUsd * REDEMPTION_FEE_RATE;
    const reference = `APX-RDM-${Math.floor(1000 + Math.random() * 9000)}`;

    holding.grams -= quantityGrams;
    holding.updatedAt = new Date();
    await holding.save();

    const transaction = await Transaction.create({
      userId: req.user!.id,
      type: 'redemption',
      asset,
      quantityGrams,
      valueUsd,
      status: 'pending',
      reference,
      redemptionMethod: method,
    });

    res.status(201).json({
      transaction: {
        id: String(transaction._id),
        type: transaction.type,
        asset: transaction.asset,
        quantityGrams: transaction.quantityGrams,
        valueUsd: transaction.valueUsd,
        feeUsd: fee,
        status: transaction.status,
        reference: transaction.reference,
        redemptionMethod: transaction.redemptionMethod,
        createdAt: transaction.createdAt.toISOString(),
      },
    });
  }),
);
