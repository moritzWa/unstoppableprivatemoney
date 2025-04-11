import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';
import { User } from './models/user';

// Define context type
interface Context {
  token?: string;
}

// Create context from request
export const createContext = ({ req }: CreateExpressContextOptions): Context => {
  const token = req.headers.authorization?.split(' ')[1];
  return { token };
};

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Middleware to verify JWT token
const isAuthed = t.middleware(async ({ next, ctx }) => {
  const token = ctx.token;
  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET || 'fallback-secret') as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        user,
      },
    });
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
