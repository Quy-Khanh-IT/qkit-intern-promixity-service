import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CommentQuery {
  @ApiProperty({ example: '6667e86e33c10381ee69412f' })
  reviewId: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '666807094f0c09a59edc6379' })
  parentCommentId: string;
}
