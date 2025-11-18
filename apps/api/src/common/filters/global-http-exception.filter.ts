import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AppError,
  NotFoundError,
  ConflictError,
  HubspotApiError,
  InfrastructureError,
} from '@shared/errors';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message = 'Unexpected error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      error = exception.name;
    } else if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
      error = 'Not Found';
      message = exception.message;
    } else if (exception instanceof ConflictError) {
      status = HttpStatus.CONFLICT;
      error = 'Conflict';
      message = exception.message;
    } else if (exception instanceof HubspotApiError) {
      status = exception.statusCode ?? HttpStatus.BAD_GATEWAY;
      error = 'HubSpot API Error';
      message = exception.message;
    } else if (exception instanceof InfrastructureError) {
      status = HttpStatus.BAD_GATEWAY;
      error = 'Infrastructure Error';
      message = exception.message;
    } else if (exception instanceof AppError) {
      status = HttpStatus.BAD_REQUEST;
      error = exception.name;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
