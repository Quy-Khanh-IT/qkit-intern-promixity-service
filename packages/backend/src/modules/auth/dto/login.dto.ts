import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { EmailRegrex } from 'src/common/utils';

export class LoginDto {
  @Matches(EmailRegrex, { message: 'email must follow with RFC 5322 standard' })
  @IsNotEmpty()
  @ApiProperty({ description: 'Email', example: 'example123@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password', example: 'Password123@' })
  password: string;
}
