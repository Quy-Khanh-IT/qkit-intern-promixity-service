import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Coffee', maxLength: 25 })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'This is a coffee category', maxLength: 255 })
  description: string;
}
