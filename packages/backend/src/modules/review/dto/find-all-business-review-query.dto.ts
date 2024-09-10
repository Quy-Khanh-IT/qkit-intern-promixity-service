import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllBusinessReviewQuery extends PartialType(
  OmitType(QueryFilterBase, ['isDeleted'] as const),
) {
  @IsOptional()
  @ApiPropertyOptional({ required: false, example: ['3', '5'] })
  starsRating: string[];

  businessId?: string;
}
