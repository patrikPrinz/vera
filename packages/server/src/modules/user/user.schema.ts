import z from 'zod';

export const bookmarkByIdSchema = z.object({ id: z.string() });

export const bookmarksByTranslationSchema = z.object({
  translation: z.string(),
});

export const createBookmarkSchema = z.object({
  authorId: z.string(),
  name: z.string(),
  location: z.object({
    translation: z.string(),
    book: z.number(),
    chapter: z.number(),
    verse: z.number(),
  }),
});

export const moveBookmarkSchema = z.object({
  id: z.string(),
  location: z.object({
    translation: z.string(),
    book: z.number(),
    chapter: z.number(),
    verse: z.number(),
  }),
});
