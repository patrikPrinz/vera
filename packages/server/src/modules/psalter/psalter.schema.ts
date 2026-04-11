import z from 'zod';

export const listPsalmsSchema = z.object({
  language: z.string(),
});

export const psalterRequestSchema = z.object({
  language: z.string(),
  number: z.string(),
});
