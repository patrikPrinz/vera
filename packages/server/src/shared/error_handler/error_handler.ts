import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errors.js';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
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
