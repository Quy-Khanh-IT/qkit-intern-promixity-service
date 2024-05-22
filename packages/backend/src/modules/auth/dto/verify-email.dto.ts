import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { OTPConstant } from 'src/common/constants';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1H34as' })
  @Length(OTPConstant.OTP_LENGTH)
  otp: string;
}
