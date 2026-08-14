import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { connectDB } from './config/db';
import { userRouter } from './routes/user.routes';
import { holdingsRouter } from './routes/holdings.routes';
import { activityRouter } from './routes/activity.routes';
import { reserveRouter } from './routes/reserve.routes';
import { buyRouter } from './routes/buy.routes';
import { redeemRouter } from './routes/redeem.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: false }));
app.use(express.json());

// Auth endpoints get a tighter limit — this is the brute-force surface.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true });

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/user', authLimiter, userRouter);
app.use('/api/holdings', apiLimiter, holdingsRouter);
app.use('/api/activity', apiLimiter, activityRouter);
app.use('/api/reserve', apiLimiter, reserveRouter);
app.use('/api/buy', apiLimiter, buyRouter);
app.use('/api/redeem', apiLimiter, redeemRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function main(): Promise<void> {
  await connectDB();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[server] failed to start', err);
  process.exit(1);
});
