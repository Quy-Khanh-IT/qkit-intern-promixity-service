import { ApiPropertyOptional, PickType } from '@nestjs/swagger';

import { CreateReviewDto } from './create-review.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StarEnum } from 'src/common/enums';

export class EditReviewDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Tôi suy nghĩ lại r !!!!' })
  content?: string;

  @IsOptional()
  @IsEnum(StarEnum)
  @ApiPropertyOptional({ enum: ['1', '2', '3', '4', '5'], example: '5' })
  star: string;
}
