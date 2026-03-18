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

export const hasRoleSchema = z.array(z.string());
