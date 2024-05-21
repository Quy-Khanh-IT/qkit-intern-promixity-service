import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { EmailRegrex } from 'src/common/utils';

export class CreateOTPRegistrationDto {
  @IsNotEmpty()
  @Matches(EmailRegrex, {
    message:
      'email Invalid. Must not contain special characters at the beginning or end of the local-part, nor contain two consecutive special characters.',
  })
  @ApiProperty({ example: 'example123@gmail.com' })
  email: string;
}
