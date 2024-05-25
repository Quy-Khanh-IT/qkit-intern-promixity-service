import { PickType } from '@nestjs/swagger';

import { CreateReviewDto } from './create-review.dto';

export class EditReviewDto extends PickType(CreateReviewDto, [
  'comment',
  'star',
]) {}
