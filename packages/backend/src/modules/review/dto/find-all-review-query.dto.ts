import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeSort } from 'src/common/enums';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllReviewQuery extends QueryFilterBase {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'hay' })
  content: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Đặng' })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Giao Kiều' })
  firstName: string;

  @IsOptional()
  @ApiPropertyOptional({ required: false, example: ['3', '5'] })
  starsRating: string[];

  @IsEnum(TypeSort)
  @ApiPropertyOptional({
    required: false,
    enum: TypeSort,
    example: TypeSort.DESC,
  })
  sortReportedCountBy: TypeSort = TypeSort.DESC;

  @IsOptional()
  @ApiPropertyOptional({ example: '66386182ae2d3279bf4791d1' })
  userId: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '6653127e796a76194e303f17' })
  businessId: string;
}
