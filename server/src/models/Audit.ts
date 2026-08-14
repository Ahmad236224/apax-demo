import { Schema, model } from 'mongoose';

export interface AuditDoc {
  ref: string;
  auditor: string;
  scope: string;
  periodLabel: string;
  issuedAt: Date;
  statusLabel: string;
}

const auditSchema = new Schema<AuditDoc>({
  ref: { type: String, required: true, unique: true },
  auditor: { type: String, required: true },
  scope: { type: String, required: true },
  periodLabel: { type: String, required: true },
  issuedAt: { type: Date, required: true },
  statusLabel: { type: String, required: true },
});

export const Audit = model<AuditDoc>('Audit', auditSchema);
