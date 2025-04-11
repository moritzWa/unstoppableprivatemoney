import { z } from 'zod';
import { Bounty } from '../models/bounty';
import { protectedProcedure, router } from '../trpc';

export const bountyRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        organisation: z.string(), // organisation ID
        submitLink: z.string().url('Must be a valid URL'),
        contactLink: z.string().url('Must be a valid URL'),
        skills: z.string().min(1, 'Skills are required'),
        prizes: z.string().min(1, 'Prizes are required'),
        prizeCurrency: z.string().min(1, 'Prize currency is required'),
        details: z.string().min(1, 'Details are required'),
      })
    )
    .mutation(async ({ input }) => {
      const bounty = new Bounty(input);
      await bounty.save();
      return bounty;
    }),
});
