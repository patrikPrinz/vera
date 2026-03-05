import z from 'zod';

export const getTranslationBookmarksSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    location: z.object({
      translation: z.string(),
      book: z.number(),
      chapter: z.number(),
      verse: z.number(),
    }),
  }),
);
