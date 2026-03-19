import { z } from 'zod';

export const loginResponseSchema = z.object({
  message: z.literal('Authenticated'),
});

export const logoutResponseSchema = z.object({});

export const userDetailsResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
});

export const userRolesResponseSchema = z
  .array(
    z.object({
      name: z.string().optional(),
      code: z.string(),
      group: z.string().optional(),
    }),
  )
  .min(0);
