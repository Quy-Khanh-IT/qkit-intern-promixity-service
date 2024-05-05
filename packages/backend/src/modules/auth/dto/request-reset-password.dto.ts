import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email', example: 'example123@gmail.com' })
  email: string;
}
