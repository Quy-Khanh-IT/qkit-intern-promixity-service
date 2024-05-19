import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
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
  email: string;
}
