import { PickType } from '@nestjs/swagger';

import { CreateReviewDto } from './create-review.dto';

export class EditResponseDto extends PickType(CreateReviewDto, ['content']) {}
