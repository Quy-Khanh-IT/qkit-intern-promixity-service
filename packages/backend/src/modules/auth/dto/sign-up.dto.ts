import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  Length,
  ArrayNotEmpty,
  IsNotEmpty,
  IsObject,
  IsArray,
  MaxLength,
  MinLength,
  IsOptional,
  ValidateNested,
  IsPhoneNumber,
} from 'class-validator';
import { OTPConstant } from 'src/common/constants';
import { AddressUser } from 'src/modules/user/entities/user.entity';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  @Length(OTPConstant.OTP_LENGTH)
  otp: string;
}
