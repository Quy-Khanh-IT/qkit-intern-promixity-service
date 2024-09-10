import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { UserConstant } from 'src/common/constants/user.constant';
import { UserRole } from 'src/common/enums';
import { EmailRegrex } from 'src/common/utils';

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
  @Matches(EmailRegrex, { message: 'email must follow with RFC 5322 standard' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(UserConstant.regexPassword, {
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
  @IsEnum(UserRole, { each: true })
  role: UserRole;

  @IsNotEmpty()
  isVerified: boolean;
}
