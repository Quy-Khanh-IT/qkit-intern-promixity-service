import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ConfigKey } from '../constants/config-key.constant';
import { error } from 'console';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly config_service: ConfigService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Server is busy, please try again later! (Internal Server Error)';
    console.error(exception);
    response.status(status).json({
      statusCode: status,
      message,
      error:
        this.config_service.get(ConfigKey.PROJECT_ENVIRONMENT) !== 'prod'
          ? {
              response: exception.response,
              stack: exception.stack,
            }
          : null,
    });
  }
}
