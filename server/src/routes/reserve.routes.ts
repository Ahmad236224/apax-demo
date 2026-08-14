import { Router } from 'express';
import { ReserveAttestation } from '../models/ReserveAttestation';
import { Audit } from '../models/Audit';
import { Custodian } from '../models/Custodian';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';

export const reserveRouter = Router();

// GET /api/reserve — proof-of-reserve figures per metal, plus certifications and custodians.
// This is protocol-wide reference data (not per-user), but still sits behind auth since
// the whole dashboard shell is gated in the product.
reserveRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [reserves, audits, custodians] = await Promise.all([
      ReserveAttestation.find().sort({ asset: 1 }),
      Audit.find().sort({ issuedAt: -1 }),
      Custodian.find().sort({ name: 1 }),
    ]);

    res.json({
      reserves: reserves.map((r) => ({
        id: String(r._id),
        asset: r.asset,
        mintedSupplyGrams: r.mintedSupplyGrams,
        auditedReserveGrams: r.auditedReserveGrams,
        auditor: r.auditor,
        periodEnd: r.periodEnd.toISOString(),
        status: r.status,
      })),
      audits: audits.map((a) => ({
        id: String(a._id),
        ref: a.ref,
        auditor: a.auditor,
        scope: a.scope,
        periodLabel: a.periodLabel,
        issuedAt: a.issuedAt.toISOString(),
        statusLabel: a.statusLabel,
      })),
      custodians: custodians.map((c) => ({
        id: String(c._id),
        name: c.name,
        city: c.city,
        licence: c.licence,
        holds: c.holds,
        segregation: c.segregation,
        insurer: c.insurer,
      })),
    });
  }),
);
