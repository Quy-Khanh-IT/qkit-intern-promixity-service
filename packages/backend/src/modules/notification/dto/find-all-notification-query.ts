import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ReviewTypeEnum, TypeSort } from 'src/common/enums';
import { NoDateQueryFilterBase } from 'src/cores/pagination/base/no-date-query-filter.base';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllNotificationQuery extends NoDateQueryFilterBase {
  @IsOptional()
  @ApiPropertyOptional({ enum: ['true', 'false'] })
  isRead: string;

  userId: string;

  @IsOptional()
  @IsEnum(TypeSort)
  @ApiPropertyOptional({
    required: false,
    enum: TypeSort,
    example: TypeSort.DESC,
  })
  sortBy: string;
}
