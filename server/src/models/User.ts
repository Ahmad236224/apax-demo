import { Schema, model, type HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { KycStatus } from '../types';

export interface UserDoc {
  fullName: string;
  email: string;
  passwordHash: string;
  kycStatus: KycStatus;
  walletAddress?: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  getJWTToken(): string;
}

const userSchema = new Schema<UserDoc>({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  kycStatus: {
    type: String,
    enum: ['unverified', 'pending', 'approved', 'rejected'],
    default: 'pending',
  },
  walletAddress: { type: String },
  createdAt: { type: Date, default: () => new Date() },
});

userSchema.methods.comparePassword = function comparePassword(
  this: HydratedDocument<UserDoc>,
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Assessment Task A: login must return a signed JWT carrying user id + email.
userSchema.methods.getJWTToken = function getJWTToken(this: HydratedDocument<UserDoc>): string {
  return jwt.sign({ id: this._id.toString(), email: this.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const User = model<UserDoc>('User', userSchema);

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}
