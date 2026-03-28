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
  title: z.string().default(null),
  slug: z.string().default(null),
  calendarDate: z.string().default(null),
  priority: z.number().default(null),
  passageLocation: passageLocationSchema,
  createdAt: z.string().optional(),
});

export const passageRequestSchema = z.object({
  passage: passageSchema,
});

export const findPassageSchema = z.object({
  param: z.string(),
});

export const deletePassageSchema = z.object({
  id: z.string(),
});
