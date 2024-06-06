import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Coffee', maxLength: 25 })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'This is a coffee category', maxLength: 255 })
  description: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com/coffee', maxLength: 255 })
  linkURL: string;
}
