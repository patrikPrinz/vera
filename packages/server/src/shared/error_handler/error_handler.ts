import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errors.js';

/**
 * Middleware processing raised error
 *
 * If error is instance of project-specific AppError class that corresponds to
 * some status code, handler will use it. Else it creates basic HTTP 500
 * server error.
 *
 * @param error error that raised while processing request
 * @param _req request object
 * @param res response object
 * @param _next express next function
 * @returns response object
 */
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // TODO: replace with logger
  console.trace(error);
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      code: error.code,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Internal server error',
    });
  }
};
