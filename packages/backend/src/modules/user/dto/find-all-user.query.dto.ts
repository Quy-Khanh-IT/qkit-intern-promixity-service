import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/common/enums';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllUserQuery extends QueryFilterBase {
  @ApiPropertyOptional({ required: false, example: 'example123@gmail.com' })
  @IsOptional()
  email: string;

  @IsString()
  @ApiPropertyOptional({ required: false, example: 'Tuan' })
  @IsOptional()
  firstName: string;

  @IsString()
  @ApiPropertyOptional({ required: false, example: 'Tuan' })
  @IsOptional()
  lastName: string;

  @IsString()
  @ApiPropertyOptional({ required: false })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    type: 'array',
    example: [UserRole.ADMIN, UserRole.USER],
  })
  @IsOptional()
  role: string[];
}
