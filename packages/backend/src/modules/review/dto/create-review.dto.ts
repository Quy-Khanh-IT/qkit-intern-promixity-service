import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'Tôi rất thích quán cà phê này, 5 sao' })
  comment: string;

  @ApiProperty({ enum: [1, 2, 3, 4, 5] })
  star: number;

  @ApiProperty({ example: '664ec849b422c0a6b3f8e350' })
  businessId: string;
}
