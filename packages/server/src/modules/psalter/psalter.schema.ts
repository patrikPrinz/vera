import z from 'zod';

export const listPsalmsSchema = z.object({
  language: z.string(),
});

export const psalterRequestSchema = z.object({
  language: z.string(),
  number: z.string(),
});

export const psalterImportSchema = z.array(
  z.object({
    language: z.string(),
    kathisma_number: z.number(),
    psalm_number: z.number(),
    title: z.string(),
    segments: z.array(z.string()),
    stasis_end: z.boolean(),
  }),
);
