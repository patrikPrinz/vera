import z from 'zod';

const locationSchema = z.object({
  translation: z.string(),
  book: z.number(),
  chapter: z.number(),
  verse: z.number(),
});

export const idSchema = z.object({ id: z.string() });

export const getByTranslationSchema = z.object({
  translation: z.string(),
});

export const createBookmarkSchema = z.object({
  authorId: z.string(),
  name: z.string(),
  location: locationSchema,
});

export const moveBookmarkSchema = z.object({
  id: z.string(),
  location: locationSchema,
});

export const createVerseMetadataSchema = z.object({
  authorId: z.string(),
  noteText: z.string(),
  highlightColor: z.string(),
  location: locationSchema,
});

export const getByChapterSchema = z.object({
  translation: z.string(),
  book: z.number(),
  chapter: z.number(),
});

export const updateVerseMetadataSchema = z.object({
  id: z.string(),
  noteText: z.string(),
  highlightColor: z.string(),
});
