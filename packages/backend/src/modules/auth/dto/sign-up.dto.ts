import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { OTPConstant, UserConstant } from 'src/common/constants';
import { EmailRegrex } from 'src/common/utils';

export class SignUpDto {
  @Matches(EmailRegrex, { message: 'email must follow with RFC 5322 standard' })
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'example123@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'Password123@' })
  @Matches(UserConstant.regexPassword, {
    message:
      'password must be 6-25 characters long, include at least one uppercase letter, one number, and one special character.',
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(2, 50)
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Length(2, 50)
  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '0389185482',
  })
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ho Chi Minh' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'District 1' })
  province: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Vietnam' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1H34as' })
  @Length(OTPConstant.OTP_LENGTH)
  otp: string;
}
