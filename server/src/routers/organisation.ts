import { z } from 'zod';
import { Organisation } from '../models/organisation';
import { protectedProcedure, router } from '../trpc';

export const organisationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        contactLink: z.string().url('Must be a valid URL'),
        logo: z.object({
          data: z.string(), // base64 string
          contentType: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const organisation = new Organisation({
        name: input.name,
        contactLink: input.contactLink,
        logo: {
          data: Buffer.from(input.logo.data, 'base64'),
          contentType: input.logo.contentType,
        },
      });

      await organisation.save();
      return organisation;
    }),

  // Add a get method to fetch organizations
  getAll: protectedProcedure.query(async () => {
    return Organisation.find().sort({ createdAt: -1 });
  }),
});
