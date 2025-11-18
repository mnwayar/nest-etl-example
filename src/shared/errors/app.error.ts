export abstract class AppError extends Error {
  public readonly cause?: unknown;

  protected constructor(message: string, cause?: unknown) {
    super(message);
    this.name = new.target.name;
    this.cause = cause;
    Error.captureStackTrace(this, new.target);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', cause?: unknown) {
    super(message, cause);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', cause?: unknown) {
    super(message, cause);
  }
}

export class HubspotApiError extends AppError {
  public readonly statusCode?: number;

  constructor(message: string, statusCode?: number, cause?: unknown) {
    super(message, cause);
    this.statusCode = statusCode;
  }
}

export class InfrastructureError extends AppError {
  constructor(message = 'Infrastructure error', cause?: unknown) {
    super(message, cause);
  }
}
