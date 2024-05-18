import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ERRORS_DICTIONARY, ERROR_CODES } from 'src/common/constants';

export const ParseFloat = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    data.forEach((data) => {
      const value =
        request?.body[data] || request?.query[data] || request?.params[data];

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

        if (request?.body[data]) request.body[data] = floatValue;
        if (request?.query[data]) request.query[data] = floatValue;
        if (request?.params[data]) request.params[data] = floatValue;
      }
    });
  },
);
