import z from 'zod';

export const idSchema = z.object({
  id: z.string(),
});

export const postSchema = z.object({
  post: z.object({
    authorId: z.string(),
    groupId: z.string(),
    title: z.string(),
    content: z.string(),
  }),
});
