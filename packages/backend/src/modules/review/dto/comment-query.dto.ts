import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ReviewTypeEnum } from 'src/common/enums';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class CommentQuery {
  @ApiProperty({ example: '6667e86e33c10381ee69412f' })
  reviewId: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '666807094f0c09a59edc6379' })
  parentCommentId: string;
}
