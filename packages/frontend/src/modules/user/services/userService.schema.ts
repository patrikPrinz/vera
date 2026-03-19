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

export const getChapterUserMetadata = z.array(
  z.object({
    id: z.string(),
    authorId: z.string(),
    noteText: z.string(),
    highlightColor: z.string(),
    location: z.object({
      translation: z.string(),
      book: z.number(),
      chapter: z.number(),
      verse: z.number(),
    }),
  }),
);

export const createUserVerseMetadata = z.object({
  id: z.string(),
  authorId: z.string(),
  noteText: z.string(),
  highlightColor: z.string(),
  location: z.object({
    translation: z.string(),
    book: z.number(),
    chapter: z.number(),
    verse: z.number(),
  }),
});

export const getUserGroupsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);
