import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Length,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import { OTPConstant, UserConstant } from 'src/common/constants';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'example123@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'Password123@' })
  @Matches(UserConstant.regexPassword, {
    message:
      'Password must be 6-25 characters long, include at least one uppercase letter, one number, and one special character.',
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
    example: 'https://example.com/image.jpg',
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
