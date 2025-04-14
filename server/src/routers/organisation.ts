import { z } from 'zod';
import { Bounty } from '../models/bounty';
import { Organisation } from '../models/organisation';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const organisationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        contactLink: z.string().url('Must be a valid URL'),
        logo: z
          .object({
            data: z.string(),
            contentType: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const organisation = new Organisation({
        name: input.name,
        contactLink: input.contactLink,
        ...(input.logo && {
          logo: {
            data: Buffer.from(input.logo.data, 'base64'),
            contentType: input.logo.contentType,
          },
        }),
      });

      await organisation.save();
      return organisation;
    }),

  // Add a get method to fetch organizations
  getAll: publicProcedure.query(async () => {
    const organisations = await Organisation.find().sort({ createdAt: -1 });

    return organisations.map((org) => ({
      id: org._id.toString(),
      name: org.name,
      logo: org.logo
        ? {
            contentType: org.logo.contentType,
          }
        : undefined,
      contactLink: org.contactLink,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    }));
  }),

  // Get organization by ID with its bounties
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const org = await Organisation.findById(input.id);
    if (!org) {
      throw new Error('Organization not found');
    }

    const bounties = await Bounty.find({ organisation: org._id }).sort({ createdAt: -1 });

    return {
      id: org._id.toString(),
      name: org.name,
      logo: org.logo
        ? {
            contentType: org.logo.contentType,
          }
        : undefined,
      contactLink: org.contactLink,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
      bounties: bounties.map((bounty) => ({
        id: bounty._id.toString(),
        name: bounty.name,
        submitLink: bounty.submitLink,
        contactLink: bounty.contactLink,
        skills: bounty.skills,
        prizes: bounty.prizes,
        prizeCurrency: bounty.prizeCurrency,
        details: bounty.details,
        createdAt: bounty.createdAt.toISOString(),
        updatedAt: bounty.updatedAt.toISOString(),
      })),
    };
  }),

  // Add a new procedure to get organization logo
  getLogo: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const org = await Organisation.findById(input.id);
    if (!org || !org.logo) {
      return null;
    }

    return {
      data: org.logo.data.toString('base64'),
      contentType: org.logo.contentType,
    };
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required'),
        contactLink: z.string().url('Must be a valid URL'),
        logo: z
          .object({
            data: z.string(), // base64 string
            contentType: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const organisation = await Organisation.findById(input.id);
      if (!organisation) {
        throw new Error('Organisation not found');
      }

      organisation.name = input.name;
      organisation.contactLink = input.contactLink;

      if (input.logo) {
        organisation.logo = {
          data: Buffer.from(input.logo.data, 'base64'),
          contentType: input.logo.contentType,
        };
      }

      await organisation.save();
      return organisation;
    }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const organisation = await Organisation.findById(input.id);
    if (!organisation) {
      throw new Error('Organisation not found');
    }

    // You might want to also delete or handle associated bounties
    await Bounty.deleteMany({ organisation: input.id });

    await organisation.deleteOne();
    return { success: true };
  }),
});
