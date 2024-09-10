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

export class NoDateQueryFilterBase {
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

  startDate: null;

  endDate: null;

  sortBy: string;

  isDeleted: null;
}
