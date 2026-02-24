export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(
    statusCode: number = 500,
    message: string = 'Internal server error',
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
