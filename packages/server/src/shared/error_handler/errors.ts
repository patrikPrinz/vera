export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(
    statusCode: number = 500,
    code: string = 'SERVER_ERROR',
    message: string = 'Internal server error',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Invalid request') {
    super(400, 'VALIDATION_ERROR', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, 'NOT_FOUND_ERROR', message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, 'NOT_FOUND_ERROR', message);
  }
}
