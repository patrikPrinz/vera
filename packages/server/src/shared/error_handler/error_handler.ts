import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors.js';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).send({
      status: error.statusCode,
      code: error.code,
      message: error.message,
    });
  } else {
    res.status(500).send({
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Internal server error',
    });
  }
};
