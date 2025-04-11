import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { User as UserModel } from './models/user';
import { createContext, publicProcedure, router } from './trpc';

// Export tRPC utilities
export { publicProcedure, router };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Import routers
import { authRouter } from './routers/auth';
import { bountyRouter } from './routers/bounty';
import { organisationRouter } from './routers/organisation';
import { paymentsRouter } from './routers/payments';

// Create app router
export const appRouter = router({
  auth: authRouter,
  payments: paymentsRouter,
  organisation: organisationRouter,
  bounty: bountyRouter,
});

export type AppRouter = typeof appRouter;

const app = express();

// Add security headers and CORS first
app.use((req, res, next) => {
  // Either remove this line entirely, or try a different value
  // res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  next();
});

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://unstoppableprivatemoney.com',
      'https://unstoppableprivatemoney-usrd.onrender.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'stripe-signature'],
  })
);

// Use JSON parser with increased limit for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

// Simple webhook handler
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Log the event
    console.log('✅ Webhook received:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;

      const user = await UserModel.findOne({ stripeCustomerId: customerId });
      if (user) {
        user.hasSubscription = true;
        await user.save();
        console.log('💳 Subscription activated for:', user.email);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const user = await UserModel.findOne({ stripeCustomerId: customerId });
      if (user) {
        user.hasSubscription = false;
        await user.save();
        console.log('❌ Subscription deactivated for:', user.email);
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('❌ Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// tRPC middleware
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ error, path }) {
      console.error(`Error in tRPC path ${path}:`, error);
      // Convert auth errors to 401 responses
      if (
        error.code === 'UNAUTHORIZED' ||
        error.message?.includes('token') ||
        error.message?.includes('jwt expired') || // Add explicit check for jwt expired
        error.name === 'TokenExpiredError' // Add check for TokenExpiredError
      ) {
        // @ts-expect-error - httpStatus is not in the type but is used by the adapter
        error.httpStatus = 401;
      }
    },
  })
);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unstoppableprivatemoney';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB ' + MONGODB_URI))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
