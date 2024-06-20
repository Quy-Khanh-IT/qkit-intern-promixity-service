import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EmotionEnum, StarEnum } from 'src/common/enums';

export class CreateReviewDto {
  @ApiProperty({ example: 'Tôi rất thích quán cà phê này, 5 sao' })
  content: string;

  @IsEnum(StarEnum)
  @ApiProperty({ enum: ['1', '2', '3', '4', '5'], example: '5' })
  star: string;

  @IsEnum(EmotionEnum)
  @ApiProperty({ enum: EmotionEnum })
  emotion: EmotionEnum;

  @ApiProperty({ example: '664ec849b422c0a6b3f8e350' })
  businessId: string;
}
