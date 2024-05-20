import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { EmailErrorValidationMessage, EmailRegrex } from 'src/common/utils';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';

export class FindAllUserQuery extends QueryFilterBase {
  @ApiProperty({ required: false, example: 'example123@gmail.com' })
  @IsOptional()
  @Matches(EmailRegrex, { message: EmailErrorValidationMessage })
  email: string;

  @IsString()
  @ApiProperty({ required: false, example: 'Tuan' })
  @IsOptional()
  @Length(2, 50)
  name: string;

  @IsString()
  @ApiProperty({ required: false, example: '038xxxxxxx' })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  @ApiProperty({ required: false, example: '5883d387971bb840b7399130' })
  @Length(24, 24)
  @IsOptional()
  businessId: string;
}
