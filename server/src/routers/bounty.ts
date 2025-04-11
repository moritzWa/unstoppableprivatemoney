import { z } from 'zod';
import { Bounty, PopulatedOrganisation } from '../models/bounty';
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

  // Add method to get all bounties
  getAll: protectedProcedure.query(async () => {
    const bounties = await Bounty.find()
      .sort({ createdAt: -1 })
      .populate<{ organisation: PopulatedOrganisation }>('organisation');

    return bounties.map((bounty) => {
      const org = bounty.organisation as PopulatedOrganisation;
      return {
        id: bounty._id.toString(),
        name: bounty.name,
        organisation: {
          id: org._id.toString(),
          name: org.name,
          logo: org.logo
            ? {
                contentType: org.logo.contentType,
              }
            : undefined,
        },
        submitLink: bounty.submitLink,
        contactLink: bounty.contactLink,
        skills: bounty.skills,
        prizes: bounty.prizes,
        prizeCurrency: bounty.prizeCurrency,
        details: bounty.details,
        createdAt: bounty.createdAt.toISOString(),
        updatedAt: bounty.updatedAt.toISOString(),
      };
    });
  }),
});
