import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Matches, Min } from 'class-validator';
import { TypeSort } from 'src/common/enums';
import { DateErrorValidationMessage, DateRegrex } from 'src/common/utils';

export class CommentFilter {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  @ApiPropertyOptional({ required: false, example: 1 })
  offset?: number = 1;

  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Exclude()
  @Min(1)
  limit?: number = 1;

  @Matches(DateRegrex, { message: `startDate ${DateErrorValidationMessage}` })
  @ApiPropertyOptional({ required: false, example: '01/01/2021' })
  @IsOptional()
  startDate: string;

  @Matches(DateRegrex, { message: `endDate ${DateErrorValidationMessage}` })
  @IsOptional()
  @ApiPropertyOptional({ required: false, example: '01/01/2021' })
  endDate: string;

  @IsOptional()
  @IsEnum(TypeSort)
  @ApiPropertyOptional({
    required: false,
    enum: TypeSort,
    example: TypeSort.DESC,
  })
  sortBy: TypeSort = TypeSort.DESC;

  isDeleted: null;
}
