import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsArray,
  IsOptional,
  IsStrongPassword,
  Matches,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { UserConstant } from 'src/common/constants/user.constant';
import { UserRole } from 'src/common/enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(UserConstant.regrexPassword, {
    message:
      'Password must be 6-25 characters long, include at least one uppercase letter, one number, and one special character.',
  })
  password: string;

  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  phoneNumber: string;

  @IsNotEmpty()
  address: {
    city: string;
    province: string;
    country: string;
  };

  @IsNotEmpty()
  @IsEnum(UserRole, { each: true })
  roles: string[];
}
