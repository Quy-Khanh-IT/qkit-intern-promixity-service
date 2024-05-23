import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from 'src/common/enums';
import { EmailErrorValidationMessage, EmailRegrex } from 'src/common/utils';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllUserQuery extends QueryFilterBase {
  @ApiPropertyOptional({ required: false, example: 'example123@gmail.com' })
  @IsOptional()
  @Matches(EmailRegrex, { message: EmailErrorValidationMessage })
  email: string;

  @IsString()
  @ApiPropertyOptional({ required: false, example: 'Tuan' })
  @IsOptional()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @ApiPropertyOptional({ required: false, example: 'Tuan' })
  @IsOptional()
  @Length(2, 50)
  lastName: string;

  @IsString()
  @ApiPropertyOptional({ required: false, example: '038xxxxxxx' })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;

  @IsEnum(UserRole)
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.ADMIN })
  @IsOptional()
  role: UserRole = UserRole.USER;
}
