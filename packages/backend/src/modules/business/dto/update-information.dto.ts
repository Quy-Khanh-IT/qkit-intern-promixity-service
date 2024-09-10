import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { DayOpenCloseTime } from './create-business.dto';

export class UpdateInformationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'JangNam' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'This is a business' })
  description?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('VN')
  @ApiPropertyOptional({ example: '0816429494' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://qkit.vn/company-profile' })
  website?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '66446d345c9bc4899106d4a6' })
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ example: '["66446c971b53183d5e868de4"]' })
  serviceIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayOpenCloseTime)
  @ApiPropertyOptional({
    example: [
      { day: 'thursday', openTime: '08:00', closeTime: '12:00' },
      { day: 'friday', openTime: '10:00', closeTime: '12:00' },
    ],
  })
  dayOfWeek?: DayOpenCloseTime[];
}
