import type { NextFunction, Request, Response } from 'express';
import { jest } from '@jest/globals';

import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from './errors.js';
import { errorHandlerFactory } from './error_handler.js';
import { WinstonLogger } from '../logger/logger.js';

const errors = [
  [new AppError(), 500, 'SERVER_ERROR'],
  [new ValidationError(), 400, 'VALIDATION_ERROR'],
  [new NotFoundError(), 404, 'NOT_FOUND_ERROR'],
  [new ConflictError(), 409, 'CONFLICT_ERROR'],
];

describe('Test HTTP status exceptions', () => {
  test.each(errors)(
    'Test app error instance',
    (error: AppError, statusCode: number, code: string) => {
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toEqual(statusCode);
      expect(error.code).toEqual(code);
    },
  );
});

const mockRequest = () => {
  return {} as Partial<Request> as Request;
};

const validatorErrors = [
  [new ValidationError('Message'), 400, 'VALIDATION_ERROR', 'Message'],
  [new Error(), 500, 'SERVER_ERROR', 'Internal server error'],
];

describe('Test error handler middleware', () => {
  test.each(validatorErrors)(
    'Test middleware with errors',
    (error: Error, statusCode: number, code: string, message: string) => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      //const error = new NotFoundError('Message');

      const errorHandler = errorHandlerFactory(new WinstonLogger());

      errorHandler(error, mockRequest(), res, jest.fn() as NextFunction);
      expect(res.json).toHaveBeenCalledWith({
        status: statusCode,
        code: code,
        message: message,
      });
    },
  );
  test('Test middleware with unknown error', () => {});
});
