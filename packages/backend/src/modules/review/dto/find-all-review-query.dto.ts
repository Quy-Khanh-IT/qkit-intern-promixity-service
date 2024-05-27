import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ReviewTypeEnum } from 'src/common/enums';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllReviewQuery extends QueryFilterBase {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'hay' })
  comment: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: ReviewTypeEnum, example: ReviewTypeEnum.REVIEW })
  type: ReviewTypeEnum;

  @IsOptional()
  @ApiPropertyOptional({ example: '3' })
  fromStar: number;

  @IsOptional()
  @ApiPropertyOptional({ example: '5' })
  toStar: number;

  @IsOptional()
  @ApiPropertyOptional({ example: '66386182ae2d3279bf4791d1' })
  user_id: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '6653127e796a76194e303f17' })
  business_id: string;
}
