import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllReviewQuery extends QueryFilterBase {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'hay' })
  content: string;

  @IsOptional()
  @ApiPropertyOptional({ required: false, example: ['3', '5'] })
  starsRating: string[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional({ type: 'number', example: 0 })
  reportedCount: number;

  @IsOptional()
  @ApiPropertyOptional({ example: '66386182ae2d3279bf4791d1' })
  userId: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '6653127e796a76194e303f17' })
  businessId: string;
}
