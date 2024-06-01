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
  @ApiPropertyOptional({ example: '0453 502 258' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '6654531573a483ab7bf58949' })
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
  @ApiPropertyOptional({ example: 'Thành phố Hồ Chí Minh' })
  province: string;

  @ApiPropertyOptional({
    example: 'approved',
    enum: BusinessStatusEnum,
  })
  status: BusinessStatusEnum;

  @IsOptional()
  @ApiPropertyOptional({
    example: JSON.stringify([
      { day: 'monday', openTime: '06:00', closeTime: '23:00' },
      { day: 'tuesday', openTime: '06:00', closeTime: '23:00' },
    ]),
  })
  dayOfWeek: string;
}
