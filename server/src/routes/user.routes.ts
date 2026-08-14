import { Router } from 'express';
import { User, hashPassword } from '../models/User';
import { requireAuth } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { asyncHandler } from '../lib/asyncHandler';

export const userRouter = Router();

function serializeUser(u: {
  _id: unknown;
  fullName: string;
  email: string;
  kycStatus: string;
  walletAddress?: string;
  createdAt: Date;
}) {
  return {
    id: String(u._id),
    fullName: u.fullName,
    email: u.email,
    kycStatus: u.kycStatus,
    walletAddress: u.walletAddress,
    createdAt: u.createdAt.toISOString(),
  };
}

// POST /user/register
userRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body ?? {};
    if (!fullName || !email || !password) {
      throw new ApiError(400, 'invalid_input', 'fullName, email and password are required');
    }
    if (String(password).length < 12) {
      throw new ApiError(400, 'weak_password', 'Password must be at least 12 characters');
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      throw new ApiError(409, 'email_taken', 'An account with that email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      fullName,
      email: String(email).toLowerCase(),
      passwordHash,
      kycStatus: 'pending',
    });

    const token = user.getJWTToken();
    res.status(201).json({ token, user: serializeUser(user) });
  }),
);

// POST /user/login — Task A: real JWT auth, no mocked success path.
userRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      throw new ApiError(400, 'invalid_input', 'email and password are required');
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw new ApiError(401, 'invalid_credentials', 'That email and password don\'t match');
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      throw new ApiError(401, 'invalid_credentials', 'That email and password don\'t match');
    }

    const token = user.getJWTToken();
    res.status(200).json({ token, user: serializeUser(user) });
  }),
);

// GET /user/me
userRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) {
      throw new ApiError(404, 'not_found', 'User not found');
    }
    res.json({ user: serializeUser(user) });
  }),
);

// PUT /user/me — profile edits from the Settings screen
userRouter.put(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { fullName } = req.body ?? {};
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { $set: { ...(fullName ? { fullName } : {}) } },
      { new: true },
    );
    if (!user) {
      throw new ApiError(404, 'not_found', 'User not found');
    }
    res.json({ user: serializeUser(user) });
  }),
);
