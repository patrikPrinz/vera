import { z } from 'zod';

export const createGroupSchema = z.object({
  group: z.object({
    name: z.string(),
  }),
});

export const removeGroupSchema = z.object({
  id: z.string(),
});

export const updateGroupSchema = z.object({
  group: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const manageUserGroupSchema = z.object({
  userId: z.string(),
  groupId: z.string(),
});

export const manageRoleSchema = z.object({
  userId: z.string(),
  roleId: z.string(),
});
