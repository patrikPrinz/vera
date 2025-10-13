import { z } from 'zod';

export const getBooksSchema = z.object({
  translation: z.string(),
});
