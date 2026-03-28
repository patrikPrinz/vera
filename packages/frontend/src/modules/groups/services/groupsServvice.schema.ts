import { z } from 'zod';

export const groupPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  groupId: z.string(),
  createdAt: z.string().optional(),
});

export const groupPostArraySchema = z.array(groupPostSchema);
