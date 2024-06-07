import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { BusinessStatusEnum, TypeSort, UserRole } from 'src/common/enums';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllUserBusinessQuery extends QueryFilterBase {
  userId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'QKIT Coffee làng đại học' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '0453 502 258' })
  phoneNumber: string;

  @IsOptional()
  @ApiPropertyOptional({
    example: ['6654531573a483ab7bf58949', '6654535673a483ab7bf5894b'],
  })
  categoryIds: string[];

  @IsOptional()
  @ApiPropertyOptional({ required: false, example: ['3', '5'] })
  starsRating: string[];

  @IsOptional()
  @IsEnum(TypeSort)
  @ApiPropertyOptional({
    required: false,
    enum: TypeSort,
    example: TypeSort.DESC,
  })
  sortTotalReviewsBy: string;

  @IsOptional()
  @IsEnum(TypeSort)
  @ApiPropertyOptional({
    required: false,
    enum: TypeSort,
    example: TypeSort.DESC,
  })
  sortRatingBy: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Phường Phạm Ngũ Lão, Quận 1' })
  address: string;

  @ApiPropertyOptional({
    example: ['approved', 'pending'],
  })
  status: BusinessStatusEnum[];

  @IsOptional()
  @ApiPropertyOptional({
    example: JSON.stringify([
      { day: 'monday', openTime: '06:00', closeTime: '23:00' },
      { day: 'tuesday', openTime: '06:00', closeTime: '23:00' },
    ]),
  })
  dayOfWeek: string;
}
