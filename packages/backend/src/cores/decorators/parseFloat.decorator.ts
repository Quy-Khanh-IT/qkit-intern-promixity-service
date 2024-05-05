import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ERRORS_DICTIONARY, ERROR_CODES } from 'src/common/constants';

export const ParseFloat = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    data.forEach((data) => {
      if (!request.body[data]) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: `Missing ${data} in request body`,
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }

      const value = request?.body[data];

      if (value) {
        const floatValue = parseFloat(value);

        if (isNaN(floatValue)) {
          throw new HttpException(
            {
              message: ERRORS_DICTIONARY.INVALID_INPUT,
              detail: `${data} must be a number`,
            },
            ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
          );
        }

        request.body[data] = floatValue;
      }
    });
  },
);
