import { connectDB } from '../config/db';
import { User, hashPassword } from '../models/User';
import { Holding } from '../models/Holding';
import { Transaction } from '../models/Transaction';
import { ReserveAttestation } from '../models/ReserveAttestation';
import { Audit } from '../models/Audit';
import { Custodian } from '../models/Custodian';
import mongoose from 'mongoose';

const DEMO_EMAIL = 'n.rasheed@meridianfamily.ae';

async function seed(): Promise<void> {
  await connectDB();

  await Promise.all([
    Holding.deleteMany({}),
    Transaction.deleteMany({}),
    ReserveAttestation.deleteMany({}),
    Audit.deleteMany({}),
    Custodian.deleteMany({}),
  ]);

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    user = await User.create({
      fullName: 'Nadia Rasheed',
      email: DEMO_EMAIL,
      passwordHash: await hashPassword('CorrectHorseBattery9!'),
      kycStatus: 'approved',
      walletAddress: '0x8f4e91c7a3b25d0e64f8a1b90c2d7e5f4a3b2c1d',
    });
  }

  await Holding.insertMany([
    {
      userId: user._id,
      asset: 'gold',
      grams: 156.75,
      custodian: 'Sidra Metals Vault, Zürich',
      fineness: '999.9',
      form: 'Cast bar, 100 g + 50 g',
      barSerials: ['AU-88412-Z', 'AU-88461-Z'],
    },
    {
      userId: user._id,
      asset: 'silver',
      grams: 892.4,
      custodian: 'Sidra Metals Vault, Zürich',
      fineness: '999.0',
      form: 'Cast bar, 1 kg',
      barSerials: ['AG-21094-Z'],
    },
    {
      userId: user._id,
      asset: 'platinum',
      grams: 45.2,
      custodian: "Brink's Depository, Singapore",
      fineness: '999.5',
      form: 'Minted bar, 50 g',
      barSerials: ['PT-40771-S'],
    },
  ]);

  await Transaction.insertMany([
    { userId: user._id, type: 'mint', asset: 'gold', quantityGrams: 25, valueUsd: 1882.83, status: 'pending', reference: '0x7c3d9e1f', createdAt: new Date('2026-08-14T09:14:00Z') },
    { userId: user._id, type: 'redemption', asset: 'silver', quantityGrams: 50, valueUsd: 44.77, status: 'confirmed', reference: '0x4c6d2e5f', createdAt: new Date('2026-08-13T16:40:00Z') },
    { userId: user._id, type: 'deposit', asset: 'gold', quantityGrams: 100, valueUsd: 7531.31, status: 'confirmed', reference: '0x2a5b7d4c', createdAt: new Date('2026-08-12T11:02:00Z') },
    { userId: user._id, type: 'mint', asset: 'platinum', quantityGrams: 20, valueUsd: 658.55, status: 'confirmed', reference: '0x9f1e8b3a', createdAt: new Date('2026-08-11T14:27:00Z') },
    { userId: user._id, type: 'transfer', asset: 'gold', quantityGrams: 10, valueUsd: 753.13, status: 'confirmed', reference: '0x51aac082', createdAt: new Date('2026-08-09T08:55:00Z') },
    { userId: user._id, type: 'burn', asset: 'silver', quantityGrams: 120, valueUsd: 107.45, status: 'failed', reference: 'APX-RDM-2041', createdAt: new Date('2026-08-07T19:12:00Z') },
    { userId: user._id, type: 'mint', asset: 'silver', quantityGrams: 500, valueUsd: 447.71, status: 'confirmed', reference: '0x6b2041de', createdAt: new Date('2026-08-04T10:31:00Z') },
    { userId: user._id, type: 'redemption', asset: 'gold', quantityGrams: 31.1, valueUsd: 2342.5, status: 'cancelled', reference: 'APX-RDM-1988', createdAt: new Date('2026-07-30T13:48:00Z') },
    { userId: user._id, type: 'deposit', asset: 'platinum', quantityGrams: 25.2, valueUsd: 829.66, status: 'confirmed', reference: '0x8d710a19', createdAt: new Date('2026-07-28T15:05:00Z') },
    { userId: user._id, type: 'mint', asset: 'gold', quantityGrams: 50, valueUsd: 3765.66, status: 'confirmed', reference: '0xa39c5f77', createdAt: new Date('2026-07-21T09:47:00Z') },
  ]);

  await ReserveAttestation.insertMany([
    { asset: 'gold', mintedSupplyGrams: 15650, auditedReserveGrams: 15680, auditor: 'Kellerman & Roth AG', periodEnd: new Date('2026-06-30'), status: 'matched' },
    { asset: 'silver', mintedSupplyGrams: 89120, auditedReserveGrams: 89240, auditor: 'Kellerman & Roth AG', periodEnd: new Date('2026-06-30'), status: 'matched' },
    { asset: 'platinum', mintedSupplyGrams: 4510, auditedReserveGrams: 4520, auditor: 'Kellerman & Roth AG', periodEnd: new Date('2026-06-30'), status: 'matched' },
  ]);

  await Audit.insertMany([
    { ref: 'POR-2026-Q2', auditor: 'Kellerman & Roth AG', scope: 'All metals · physical count', periodLabel: '01 Apr — 30 Jun 2026', issuedAt: new Date('2026-07-14'), statusLabel: 'Current' },
    { ref: 'SHC-2026-041', auditor: 'Sidra Advisory Board', scope: 'Sharia compliance review', periodLabel: '01 Jan — 31 Mar 2026', issuedAt: new Date('2026-04-22'), statusLabel: 'Active to Mar 2027' },
    { ref: 'INS-88-4417', auditor: "Lloyd's Syndicate 2623", scope: 'Vault custody & all-risk insurance', periodLabel: 'Policy year 2026', issuedAt: new Date('2026-01-02'), statusLabel: 'Active to Jan 2027' },
    { ref: 'POR-2026-Q1', auditor: 'Kellerman & Roth AG', scope: 'All metals · physical count', periodLabel: '01 Jan — 31 Mar 2026', issuedAt: new Date('2026-04-11'), statusLabel: 'Superseded' },
    { ref: 'VQF-2026-118', auditor: 'VQF Self-Regulatory Org.', scope: 'AML / CFT programme', periodLabel: 'Programme year 2026', issuedAt: new Date('2026-02-09'), statusLabel: 'Renewal due Sep 2026' },
  ]);

  await Custodian.insertMany([
    { name: 'Sidra Metals Vault', city: 'Zürich, CH', licence: 'FINMA-registered depository', holds: 'Gold, silver', segregation: 'Allocated, segregated', insurer: "Lloyd's Syndicate 2623" },
    { name: "Brink's Depository", city: 'Singapore, SG', licence: 'MAS-approved vault operator', holds: 'Platinum', segregation: 'Allocated, segregated', insurer: "Lloyd's Syndicate 2623" },
  ]);

  // eslint-disable-next-line no-console
  console.log(`[seed] done. Demo login: ${DEMO_EMAIL} / CorrectHorseBattery9!`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] failed', err);
  process.exit(1);
});
