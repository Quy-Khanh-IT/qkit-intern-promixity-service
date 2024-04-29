import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOTPRegistrationDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example123@gmail.com' })
  email: string;
}
