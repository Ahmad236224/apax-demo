import { Router } from 'express';
import { Transaction } from '../models/Transaction';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';

export const activityRouter = Router();

// GET /api/activity?asset=&type=&status=&page=&pageSize= (auth required)
activityRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { asset, type, status } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 10));

    const filter: Record<string, unknown> = { userId: req.user!.id };
    if (asset && asset !== 'all') filter.asset = asset;
    if (type && type !== 'all') filter.type = type;
    if (status && status !== 'all') filter.status = status;

    const [rows, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      transactions: rows.map((t) => ({
        id: String(t._id),
        type: t.type,
        asset: t.asset,
        quantityGrams: t.quantityGrams,
        valueUsd: t.valueUsd,
        status: t.status,
        reference: t.reference,
        redemptionMethod: t.redemptionMethod,
        createdAt: t.createdAt.toISOString(),
      })),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  }),
);
