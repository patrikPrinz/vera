import z from 'zod';

export const psalterRequestSchema = z.object({
  language: z.string(),
  number: z.string(),
});
