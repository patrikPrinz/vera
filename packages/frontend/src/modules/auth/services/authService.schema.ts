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
