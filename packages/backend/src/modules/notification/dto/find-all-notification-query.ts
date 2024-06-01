import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ReviewTypeEnum } from 'src/common/enums';
import { NoDateQueryFilterBase } from 'src/cores/pagination/base/no-date-query-filter.base';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllNotificationQuery extends NoDateQueryFilterBase {
  @IsOptional()
  @ApiPropertyOptional()
  isRead: string;
}
