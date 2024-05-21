import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { EmailRegrex } from 'src/common/utils';

export class RestoreResponseDto {
  @IsNotEmpty()
  id: string;

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

  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  phoneNumber: string;
}
