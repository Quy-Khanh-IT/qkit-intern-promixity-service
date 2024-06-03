import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ReviewTypeEnum } from 'src/common/enums';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllReviewQuery extends QueryFilterBase {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'hay' })
  content: string;

  @IsOptional()
  @ApiPropertyOptional({ example: ['reply', 'review'] })
  type: ReviewTypeEnum[];

  @IsOptional()
  @ApiPropertyOptional({ required: false, example: ['3', '5'] })
  starsRating: string[];

  @IsOptional()
  @ApiPropertyOptional({ example: '66386182ae2d3279bf4791d1' })
  userId: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '6653127e796a76194e303f17' })
  businessId: string;
}
