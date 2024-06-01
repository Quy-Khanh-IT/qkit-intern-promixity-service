import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { OTPConstant } from 'src/common/constants';
import { EmailRegrex } from 'src/common/utils';

export class RequesUpdateEmail {
  @IsNotEmpty()
  @ApiProperty({
    description: 'your current password',
    example: 'Password123@',
  })
  password: string;

  @Matches(EmailRegrex, { message: 'email must follow with RFC 5322 standard' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email',
    example: 'example123@gmail.com',
  })
  newEmail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1H34as' })
  @Length(OTPConstant.OTP_LENGTH)
  otp: string;
}
