import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StarEnum } from 'src/common/enums';
import { CreateReviewDto } from 'src/modules/review/dto/create-review.dto';

@Injectable()
export class StarSerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let { body } = context.switchToHttp().getRequest();

    body = body as CreateReviewDto;

    if (body.star) {
      switch (body.star) {
        case 1:
          body.star = 'ONE';
          break;
        case 2:
          body.star = 'TWO';
          break;
        case 3:
          body.star = 'THREE';
          break;
        case 4:
          body.star = 'FOUR';
          break;
        case 5:
          body.star = 'FIVE';
          break;
      }
    }

    return next.handle().pipe(tap());
  }
}
