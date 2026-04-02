import z from 'zod';

export const postRegisterSchema = z.object({
  email: z.email(),
  password: z.string(),
  passwordCheck: z.string(),
});

export const postLoginSchema = z.object({
  login: z.string(),
  password: z.string(),
});

const roles = [
  'admin',
  'translation_admin',
  'calendar_admin',
  'prayer_admin',
  'group_admin',
  'group_content_admin',
] as const;

export const hasRoleSchema = z.array(z.enum(roles));
