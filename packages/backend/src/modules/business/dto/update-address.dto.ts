import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBusinessDto } from './create-business.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOpenCloseTimeSchema } from '../entities/dayOpenCloseTime.entity';

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lý Tự Trọng' })
  addressLine: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Hồ Chí Minh' })
  province: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Quận 1' })
  district: string;

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
