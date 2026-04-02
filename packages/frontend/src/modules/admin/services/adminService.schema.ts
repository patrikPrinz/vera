import { z } from 'zod';

export const getUsersResponseSchema = z.array(
  z.object({
    id: z.string(),
    email: z.string(),
    username: z.string().nullable(),
  }),
);

export const groupResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const getGroupsResponseSchema = z.array(groupResponseSchema);

export const getRolesResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    groupRole: z.boolean(),
  }),
);
