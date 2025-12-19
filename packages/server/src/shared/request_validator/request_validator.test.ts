import z from 'zod';
import type { Request, Response } from 'express';
import { requestValidator } from './request_validator.js';
import { ValidationError } from '../error_handler/errors.js';
import { jest } from '@jest/globals';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

const mockRequest = (params: unknown) => {
  return { params: params } as Partial<Request> as Request;
};

const mockResponse = () => {
  return {} as unknown as Response;
};

describe('test request validator', () => {
  test('test valid data', () => {
    const next = jest.fn();
    const validator = requestValidator(schema);
    const params = { name: 'John', age: 42 };
    validator(mockRequest(params), mockResponse(), next);
    expect(next).toBeCalled();
  });

  test('test request vith invalid parameters', () => {
    const next = jest.fn();
    const validator = requestValidator(schema);
    const params = {};
    validator(mockRequest(params), mockResponse(), next);
    expect(next).toBeCalledWith(expect.any(ValidationError));
  });
});
