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

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Coffee', maxLength: 25 })
  name: string;
}
