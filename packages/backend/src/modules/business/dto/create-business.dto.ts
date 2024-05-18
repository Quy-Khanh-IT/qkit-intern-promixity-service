import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsArray,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  IsEnum,
  Matches,
} from 'class-validator';
import { BusinessConstant } from 'src/common/constants/business.constant';
import { DayEnum } from 'src/common/enums';

export class DayOpenCloseTime {
  @IsEnum(DayEnum) // Validate against the DayEnum enum
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
}

export class CreateBusinessDto {
  @ApiProperty({ example: 'QKIT Coffee làng đại học' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'This is coffee shop' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '66446d345c9bc4899106d4a6' })
  category: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  @ApiProperty({ example: '0816429333' })
  phoneNumber: string;

  @IsOptional()
  @ApiProperty({ example: 'https://qkit.vn/company-profile' })
  website: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayOpenCloseTime)
  @ApiProperty({
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lý Tự Trọng' })
  addressLine: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @ApiProperty({ example: '106.698387' })
  longitude: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @ApiProperty({ example: '10.775114' })
  latitude: string;
}
