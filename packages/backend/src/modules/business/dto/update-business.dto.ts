import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBusinessDto, DayOpenCloseTime } from './create-business.dto';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBusinessDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'JangNam' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'This is a business' })
  description?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('VN')
  @ApiProperty({ example: '0816429494' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'https://qkit.vn/company-profile' })
  website?: string;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CloundinaryImage)
  // images?: CloundinaryImage[];

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '66446d345c9bc4899106d4a6' })
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: '["66446c971b53183d5e868de4"]' })
  services?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayOpenCloseTime)
  @ApiProperty({
    example: [
      { day: 'thursday', openTime: '08:00', closeTime: '12:00' },
      { day: 'friday', openTime: '10:00', closeTime: '12:00' },
    ],
  })
  dayOfWeek?: DayOpenCloseTime[];
}
