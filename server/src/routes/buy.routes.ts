import { Router } from 'express';
import { randomUUID } from 'crypto';
import { Holding } from '../models/Holding';
import { Transaction } from '../models/Transaction';
import { requireAuth } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { asyncHandler } from '../lib/asyncHandler';
import { gramsToUsd, METAL_REFERENCE } from '../config/metals';
import type { MetalKey } from '../types';

export const buyRouter = Router();

const MINT_FEE_RATE = 0.005;
const VALID_ASSETS: MetalKey[] = ['gold', 'silver', 'platinum'];

// POST /api/buy { asset, grams } (auth required)
// Records a pending "mint" transaction and reserves the value at today's
// reference price. No on-chain minting happens here — see README for why
// this build stops at "deposit confirmed, pending vault countersignature"
// rather than actually issuing tokens.
buyRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { asset, grams } = req.body ?? {};
    if (!VALID_ASSETS.includes(asset)) {
      throw new ApiError(400, 'invalid_asset', 'asset must be gold, silver or platinum');
    }
    const quantityGrams = Number(grams);
    if (!Number.isFinite(quantityGrams) || quantityGrams <= 0) {
      throw new ApiError(400, 'invalid_quantity', 'grams must be a positive number');
    }

    const valueUsd = gramsToUsd(asset, quantityGrams);
    const fee = valueUsd * MINT_FEE_RATE;
    const reference = `0x${randomUUID().replace(/-/g, '').slice(0, 12)}`;

    const transaction = await Transaction.create({
      userId: req.user!.id,
      type: 'mint',
      asset,
      quantityGrams,
      valueUsd,
      status: 'pending',
      reference,
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
        createdAt: transaction.createdAt.toISOString(),
      },
    });
  }),
);

// POST /api/buy/:id/confirm (auth required)
// Simulates the vault countersignature: marks the mint confirmed and credits
// the holding. Stands in for what would otherwise be an on-chain mint event.
buyRouter.post(
  '/:id/confirm',
  requireAuth,
  asyncHandler(async (req, res) => {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user!.id,
      type: 'mint',
    });
    if (!transaction) {
      throw new ApiError(404, 'not_found', 'Mint transaction not found');
    }
    if (transaction.status !== 'pending') {
      throw new ApiError(409, 'invalid_state', 'Transaction is not pending');
    }

    transaction.status = 'confirmed';
    await transaction.save();

    const ref = METAL_REFERENCE[transaction.asset];
    await Holding.findOneAndUpdate(
      { userId: req.user!.id, asset: transaction.asset },
      {
        $inc: { grams: transaction.quantityGrams },
        $setOnInsert: {
          custodian: 'Sidra Metals Vault, Zürich',
          fineness: ref.fineness,
          form: 'Cast bar',
          barSerials: [],
        },
        $set: { updatedAt: new Date() },
      },
      { upsert: true },
    );

    res.json({ transaction: { id: String(transaction._id), status: transaction.status } });
  }),
);
