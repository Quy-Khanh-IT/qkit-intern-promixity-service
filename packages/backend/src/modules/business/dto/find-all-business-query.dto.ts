import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BusinessStatusEnum } from 'src/common/enums';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllBusinessQuery extends QueryFilterBase {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'QKIT Coffee làng đại học' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '0816429***' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '66446d345c9bc4899106d4a6' })
  categoryId: string;

  @IsOptional()
  @ApiPropertyOptional({ required: false, example: ['3', '5'] })
  starsRating: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Quận 1' })
  district: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'TP Hồ Chí Minh' })
  province: string;

  @ApiPropertyOptional({
    example: 'approved',
    enum: BusinessStatusEnum,
  })
  status: BusinessStatusEnum;

  @IsOptional()
  @ApiPropertyOptional({
    example:
      "[{'day':'monday','openTime':'08:00','closeTime':'12:00'}, {'day':'tuesday','openTime':'10:00','closeTime':'12:00'}]",
  })
  dayOfWeek: string;
}
