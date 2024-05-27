import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { BusinessConstant } from 'src/common/constants/business.constant';
import { DayEnum } from 'src/common/enums';

export class DayOpenCloseTime {
  @IsEnum(DayEnum)
  @ApiProperty({ enum: DayEnum })
  day: string;

  @Matches(BusinessConstant.regexOpenCloseTime, {
    message:
      'Invalid open time format. Open time must be in format HH:MM or HH must be 00 to 23 or MM must be one of 00, 05, 10, 15,..., 50, 55',
  })
  @ApiProperty({ example: '08:00' })
  openTime: string;

  @Matches(BusinessConstant.regexOpenCloseTime, {
    message:
      'Invalid close time format. Close time must be in format HH:MM or HH must be 00 to 23 or MM must be one of 00, 05, 10, 15,..., 50, 55',
  })
  @ApiProperty({ example: '12:00' })
  closeTime: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(7)
  @ApiPropertyOptional()
  order: number;
}

export class CreateBusinessDto {
  @ApiProperty({ example: 'QKIT Coffee làng đại học' })
  name: string;

  @IsString()
  @ApiPropertyOptional({ example: 'This is coffee shop' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '66446d345c9bc4899106d4a6' })
  category_id: string;

  @IsArray()
  @ApiPropertyOptional({ example: ['66446c971b53183d5e868de4'] })
  services_id: string[];

  @IsPhoneNumber('VN')
  @ApiPropertyOptional({ example: '0816429333' })
  phoneNumber: string;

  @IsOptional()
  @ApiProperty({ example: 'https://qkit.vn/company-profile' })
  website: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayOpenCloseTime)
  @ApiPropertyOptional({
    example: [{ day: 'monday', openTime: '08:00', closeTime: '12:00' }],
  })
  dayOfWeek: DayOpenCloseTime[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Việt Nam', default: 'Việt Nam' })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Hồ Chí Minh' })
  province: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Quận 1' })
  district: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Lý Tự Trọng' })
  addressLine: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '612/A Lý Tự Trọng' })
  fullAddress: string;

  @IsNotEmpty()
  @ApiProperty({
    example: {
      coordinates: [106.698387, 10.775114],
    },
  })
  location: {
    coordinates: number[];
  };
}
