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
    const organisations = await Organisation.find().sort({ createdAt: -1 });

    return organisations.map((org) => ({
      id: org._id.toString(),
      name: org.name,
      logo: {
        contentType: org.logo.contentType,
      },
      contactLink: org.contactLink,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    }));
  }),

  // Add a new procedure to get organization logo
  getLogo: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const org = await Organisation.findById(input.id);
    if (!org || !org.logo) {
      return null;
    }

    return {
      contentType: org.logo.contentType,
      data: org.logo.data.toString('base64'),
    };
  }),
});
