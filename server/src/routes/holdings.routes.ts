import { Router } from 'express';
import { Holding } from '../models/Holding';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';

export const holdingsRouter = Router();

// GET /api/holdings (auth required) — shaped for the portfolio UI, grouped by metal.
holdingsRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const holdings = await Holding.find({ userId: req.user!.id }).sort({ asset: 1 });

    res.json({
      holdings: holdings.map((h) => ({
        id: String(h._id),
        asset: h.asset,
        grams: h.grams,
        custodian: h.custodian,
        fineness: h.fineness,
        form: h.form,
        barSerials: h.barSerials,
        updatedAt: h.updatedAt.toISOString(),
      })),
    });
  }),
);
