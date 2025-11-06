import { z } from 'zod';

export const getMetadataSchema = z.object({
  translation: z.string(),
});

export const getBooksSchema = z.object({
  translation: z.string(),
});

export const getChaptersSchema = z.object({
  translation: z.string(),
  book: z.string(),
});

export const getVersesSchema = z.object({
  translation: z.string(),
  book: z.string(),
  chapter: z.string(),
});
export const getVerseSchema = z.object({
  id: z.string(),
});
