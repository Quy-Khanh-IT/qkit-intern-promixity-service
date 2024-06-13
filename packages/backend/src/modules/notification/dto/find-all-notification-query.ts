import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TypeSort } from 'src/common/enums';
import { NoDateQueryFilterBase } from 'src/cores/pagination/base/no-date-query-filter.base';

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
