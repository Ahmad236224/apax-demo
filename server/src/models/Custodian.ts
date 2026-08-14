import { Schema, model } from 'mongoose';

export interface CustodianDoc {
  name: string;
  city: string;
  licence: string;
  holds: string;
  segregation: string;
  insurer: string;
}

const custodianSchema = new Schema<CustodianDoc>({
  name: { type: String, required: true },
  city: { type: String, required: true },
  licence: { type: String, required: true },
  holds: { type: String, required: true },
  segregation: { type: String, required: true },
  insurer: { type: String, required: true },
});

export const Custodian = model<CustodianDoc>('Custodian', custodianSchema);
