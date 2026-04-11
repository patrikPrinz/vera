import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../error_handler/errors.js';
import type { ValidatedRequest } from './request_validator.types.js';
import { z, ZodType } from 'zod';

/**
 *Function creates request validator middleware, which compares request params
 *property with ZOD schema. If parsing fails, it calls error handler middleware.
 * @param schema ZOD schema
 * @param part string specifying which property of request should be validated
 * @returns validator middleware function
 */
export function requestValidator<T extends ZodType>(
  schema: T,
  part: string = 'params',
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse(req[part]);
      (req as ValidatedRequest<z.infer<typeof schema>>).validated = parsedData;
      next();
    } catch (error) {
      next(new ValidationError('Bad request format', error as Error));
    }
  };
}
