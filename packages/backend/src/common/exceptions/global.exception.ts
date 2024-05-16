import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ConfigKey } from '../constants/config-key.constant';

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

    if (status == 400) {
      console.log('Validation Exception');
      exception.response = exception.response.message.reduce((acc, curr) => {
        const [field, ...errorMessages] = curr.split(' ');
        acc[field] = (acc[field] || []).concat(errorMessages.join(' '));
        return acc;
      }, {});
    }
    response.status(status).json({
      statusCode: status,
      message,
      errors: {
        ...exception.response,
      },
      stack:
        this.config_service.get(ConfigKey.PROJECT_ENVIRONMENT) !== 'prod'
          ? exception.stack
          : null,
    });
  }
}
