import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import * as dayjs from 'dayjs';
import { BusinessStatusEnum, UserStatus } from 'src/common/enums';
import { TimeLineType } from 'src/common/enums/statistic.enum';

export enum BusinessStatusStatisticEnum {
  PENDING = BusinessStatusEnum.PENDING,
  APPROVED = BusinessStatusEnum.APPROVED,
  REJECTED = BusinessStatusEnum.REJECTED,
  CLOSED = BusinessStatusEnum.CLOSED,
  BANNED = BusinessStatusEnum.BANNED,
  DELETED = 'deleted', // Corrected typo from 'deteted' to 'deleted'
  ALL = 'all',
}

export enum UserStatusStatisticEnum {
  ACTIVE = UserStatus.ACTIVE,
  DELETED = UserStatus.DELETED,
  ALL = 'all',
}

export class StatisticUserBusinessDto {
  @ApiPropertyOptional({
    description: 'Time line for statistic',
    enum: TimeLineType,
  })
  @IsOptional()
  @IsEnum(TimeLineType)
  timeline: TimeLineType = TimeLineType.YEAR;

  @ApiPropertyOptional({
    description: 'Year for statistic',
    default: dayjs().year(),
  })
  @IsOptional()
  year: number = dayjs().year();

  @ApiPropertyOptional({
    description: 'Month for statistic',
  })
  @ValidateIf((o) => o.timeline === TimeLineType.MONTH)
  @IsNotEmpty()
  month: number;

  @ApiPropertyOptional({
    description: 'Statistic of category',
    enum: BusinessStatusStatisticEnum,
  })
  @IsEnum(BusinessStatusStatisticEnum)
  statusBusiness: BusinessStatusStatisticEnum = BusinessStatusStatisticEnum.ALL;

  @ApiPropertyOptional({
    description: 'Statistic of category',
    enum: UserStatusStatisticEnum,
  })
  @IsEnum(UserStatusStatisticEnum)
  statusUser: UserStatusStatisticEnum = UserStatusStatisticEnum.ALL;
}
