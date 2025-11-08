import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../error_handler/errors.js';
import type { ValidatedRequest } from './request_validator.types.js';
import { z, ZodType } from 'zod';

export function requestValidator<T extends ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse(req.params);
      (req as ValidatedRequest<z.infer<typeof schema>>).validated = parsedData;
      next();
    } catch (_error) {
      next(new ValidationError('Bad request format'));
    }
  };
}
