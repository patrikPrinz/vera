import type { NextFunction, Request, Response } from 'express';
import { AuthError } from '../error_handler/errors.js';

export const authenticated = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return next(new AuthError());
};
