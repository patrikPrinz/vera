import { z } from 'zod';

export const getUsersResponseSchema = z.array(
  z.object({
    id: z.string(),
    email: z.string(),
    username: z.string().nullable(),
  }),
);

export const getGroupsResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export const createGroupResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});
