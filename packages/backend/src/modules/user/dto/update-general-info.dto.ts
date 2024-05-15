import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateGeneralInfoDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '0389185482',
  })
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Ho Chi Minh' })
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'District 1' })
  province: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Vietnam' })
  country: string;
}
