import { z } from 'zod';

export const passageSegmentSchema = z.object({
  startChapter: z.number(),
  startVerse: z.number(),
  endChapter: z.number().optional(),
  endVerse: z.number(),
});

export const passageLocationSchema = z.object({
  book: z.number(),
  segments: z.array(passageSegmentSchema),
});

export const passageSchema = z.object({
  id: z.string().optional(),
  authorId: z.string(),
  title: z.string().nullable(),
  slug: z.string(),
  calendarDate: z.string(),
  priority: z.number(),
  passageLocation: passageLocationSchema,
  createdAt: z.string().optional(),
});

export const createPassageSchema = z.object({
  passage: passageSchema,
});
