import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ example: 'QKIT Coffee làng đại học' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is coffee shop' })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Coffee' })
  category: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  @ApiProperty({ example: '0816429333' })
  phoneNumber: string;

  @IsOptional()
  @ApiProperty({ example: 'https://qkit.vn/company-profile' })
  website: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: [{ day: 'Monday', openTime: '08:00', closeTime: '12:00' }],
  })
  dayOfWeek: Array<{ day: string; openTime: string; closeTime: string }>;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Việt Nam' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Hồ Chí Minh' })
  province: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Quận 1' })
  district: string;

  @IsOptional()
  @ApiProperty({ example: '7060 Lý' })
  addressLine: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @ApiProperty({ example: '106.7824431' })
  longitude: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @ApiProperty({ example: '10.8826391' })
  latitude: string;
}
