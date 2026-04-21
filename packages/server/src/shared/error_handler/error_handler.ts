import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errors.js';
import type { LoggerPort } from '../logger/logger_port.js';

export function errorHandlerFactory(
  logger: LoggerPort,
): (error: unknown, _req: Request, res: Response, _next: NextFunction) => void {
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
  return (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    let responseError = new AppError(
      500,
      'SERVER_ERROR',
      'Internal server error',
      error as Error,
    );
    if (error instanceof AppError) {
      responseError = error;
    }

    // console.log(responseError);
    logger.error('Response error', responseError);

    res.status(responseError.statusCode).json({
      status: responseError.statusCode,
      code: responseError.code,
      message: responseError.message,
    });
  };
}
