import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StarEnum } from 'src/common/enums';

export class EditReviewDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Tôi suy nghĩ lại r !!!!' })
  content?: string;

  @IsOptional()
  @IsEnum(StarEnum)
  @ApiPropertyOptional({ enum: ['1', '2', '3', '4', '5'], example: '5' })
  star: string;
}
