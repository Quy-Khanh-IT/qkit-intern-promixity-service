import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { EmailRegrex } from 'src/common/utils';

export class UpdateEmailDto {
  @IsNotEmpty()
  @Matches(EmailRegrex, { message: 'email must follow with RFC 5322 standard' })
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
