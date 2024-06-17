import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 'Tôi rất thích quán cà phê này, 5 sao' })
  content: string;
}
