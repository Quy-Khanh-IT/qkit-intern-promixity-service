import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  Matches,
  Min,
} from 'class-validator';
import { TypeSort } from 'src/common/enums';
import { DateErrorValidationMessage, DateRegrex } from 'src/common/utils';

export class QueryFilterBase {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @ApiPropertyOptional({ required: false, example: 1 })
  @Min(1)
  offset?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  @ApiPropertyOptional({ required: false, example: 20 })
  @IsNumber()
  @Min(1)
  limit?: number = 20;

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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @ApiPropertyOptional({ required: false })
  isDeleted: boolean = false;
}
