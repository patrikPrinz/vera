/**
 * Class lets user know about exceptions, that ocured during request processing.
 * Each has corresponding message and HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly source: Error;

  constructor(
    statusCode: number = 500,
    code: string = 'SERVER_ERROR',
    message: string = 'Internal server error',
    source: Error | undefined = undefined,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.source = source;
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = 'Invalid request',
    source: Error | undefined = undefined,
  ) {
    super(400, 'VALIDATION_ERROR', message, source);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Request needs authentication') {
    super(401, 'AUTH_ERROR', message);
  }
}

export class PermissionError extends AppError {
  constructor(message = 'User not permitted to perform this operation') {
    super(403, 'PERMISSION_ERROR', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, 'NOT_FOUND_ERROR', message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict ocured with existing resources') {
    super(409, 'CONFLICT_ERROR', message);
  }
}
